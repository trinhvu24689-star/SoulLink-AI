import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// --- AUDIO HELPERS ---
function floatTo16BitPCM(float32Array: Float32Array): string {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes.buffer;
}

export class SoulLinkLiveClient {
  // --- KHAI BÁO BIẾN (Fix lỗi TS2339) ---
  private ai: any;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private outputNode: GainNode | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private nextStartTime: number = 0;
  private session: any = null;
  private isConnected: boolean = false;
  private currentSystemInstruction: string;
  private currentLanguage: string = 'vi';

  public onStateChange: (state: 'connecting' | 'connected' | 'disconnected' | 'speaking') => void = () => {};

  constructor(systemInstruction: string) {
    const apiKey = import.meta.env.VITE_API_KEY || import.meta.env.GEMINI_API_KEY || '';
    this.ai = new GoogleGenAI(apiKey);
    this.currentSystemInstruction = systemInstruction;
  }

  setLanguage(lang: string) {
    this.currentLanguage = lang;
  }

  async connect() {
    if (this.isConnected) return;
    this.onStateChange('connecting');
    this.nextStartTime = 0;
    
    try {
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      this.outputNode = this.outputAudioContext.createGain();
      this.outputNode.connect(this.outputAudioContext.destination);

      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: { channelCount: 1, sampleRate: 16000, echoCancellation: true, noiseSuppression: true }
      });

      const MODEL_NAME = 'gemini-2.0-flash-exp'; 
      const langNames: any = { vi: 'Tiếng Việt', en: 'English', zh: 'Chinese', ja: 'Japanese' };
      const languageInstruction = `\n\nIMPORTANT: Always respond in ${langNames[this.currentLanguage] || 'Tiếng Việt'}.`;

      this.session = await this.ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: { parts: [{ text: this.currentSystemInstruction + languageInstruction }] },
          generationConfig: {
              speechConfig: {
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } }
              }
          }
        },
        callbacks: {
            onopen: () => {
                this.isConnected = true;
                this.onStateChange('connected');
                this.startMicrophoneInput();
            },
            onmessage: (message: LiveServerMessage) => this.handleServerMessage(message),
            onclose: () => this.disconnect(),
            onerror: (err: any) => { console.error(err); this.disconnect(); }
        }
      });
    } catch (error) {
      console.error("Live connection failed", error);
      this.onStateChange('disconnected');
      this.disconnect();
    }
  }

  private startMicrophoneInput() {
    if (!this.inputAudioContext || !this.mediaStream || !this.session) return;
    if (this.inputAudioContext.state === 'suspended') this.inputAudioContext.resume();

    this.sourceNode = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
    this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const base64Audio = floatTo16BitPCM(inputData);
      this.session.sendRealtimeInput([{ mimeType: "audio/pcm;rate=16000", data: base64Audio }]);
    };

    this.sourceNode.connect(this.processor);
    this.processor.connect(this.inputAudioContext.destination);
  }

  private handleServerMessage(message: LiveServerMessage) {
    const inlineData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData;
    if (inlineData?.data) {
      this.onStateChange('speaking');
      this.playAudioChunk(inlineData.data);
    }
    if (message.serverContent?.turnComplete) this.onStateChange('connected');
    if (message.serverContent?.interrupted) this.stopAudioOutput();
  }

  private async playAudioChunk(base64String: string) {
    if (!this.outputAudioContext || !this.outputNode) return;
    try {
      if (this.outputAudioContext.state === 'suspended') await this.outputAudioContext.resume();
      const arrayBuffer = base64ToArrayBuffer(base64String);
      const int16Array = new Int16Array(arrayBuffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) float32Array[i] = int16Array[i] / 32768.0;

      const audioBuffer = this.outputAudioContext.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);
      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputNode);

      const startTime = Math.max(this.outputAudioContext.currentTime, this.nextStartTime);
      source.start(startTime);
      this.nextStartTime = startTime + audioBuffer.duration;
    } catch (e) { console.error(e); }
  }

  stopAudioOutput() {
    this.nextStartTime = 0;
  }

  disconnect() {
    this.isConnected = false;
    if (this.processor) this.processor.disconnect();
    if (this.sourceNode) this.sourceNode.disconnect();
    if (this.mediaStream) this.mediaStream.getTracks().forEach(t => t.stop());
    if (this.inputAudioContext) this.inputAudioContext.close();
    if (this.outputAudioContext) this.outputAudioContext.close();
    if (this.session) try { this.session.close(); } catch(e) {}
    this.onStateChange('disconnected');
  }
}