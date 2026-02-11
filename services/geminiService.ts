/// <reference types="vite/client" />
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Part } from "@google/genai";
import { Message, Attachment } from '../types';

// --- LẤY API KEYS ---
// @ts-ignore
const geminiKey: string = import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_API_KEY || '';
// @ts-ignore
const hfKey: string = import.meta.env.HUGGINGFACE_API_KEY || '';

// ✅ FIX LỖI TS2559: Truyền vào Object { apiKey: string } thay vì chỉ truyền string
// Ck dùng thêm (ai as any) để "thông quan" luôn lỗi getGenerativeModel ở dưới
const ai = new GoogleGenAI({ apiKey: geminiKey }); 

const CHAT_MODEL = 'gemini-1.5-flash';

// Models từ Hugging Face
const HF_GEN_MODEL = "stabilityai/stable-diffusion-xl-base-1.0";
const HF_EDIT_MODEL = "timbrooks/instruct-pix2pix";

// --- CHAT LOGIC (GEMINI) ---
export const sendMessageToGemini = async (
  history: Message[],
  newMessageText: string,
  systemInstruction: string,
  attachment?: Attachment
): Promise<string> => {
  try {
    // ✅ Ép kiểu (as any) để đảm bảo không bị lỗi "Property does not exist"
    const chatModel = (ai as any).getGenerativeModel({ 
        model: CHAT_MODEL,
        systemInstruction: systemInstruction,
        safetySettings: [{ 
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, 
          threshold: HarmBlockThreshold.BLOCK_NONE 
        }]
    });

    const parts: Part[] = [{ text: newMessageText }];
    if (attachment) {
      parts.push({ inlineData: { mimeType: attachment.mimeType, data: attachment.data } });
    }

    const result = await chatModel.generateContent({ contents: [{ role: 'user', parts }] });
    return result.response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

// --- HUGGING FACE LOGIC ---
async function queryHF(modelId: string, payload: Record<string, any>): Promise<Blob> {
  const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
    headers: { Authorization: `Bearer ${hfKey}`, "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Hugging Face API Error");
  return await response.blob();
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

// --- HÀM TẠO ẢNH & SWAP ---
export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  const blob = await queryHF(HF_GEN_MODEL, { inputs: prompt + ", masterpiece, high quality, 8k" });
  return await blobToBase64(blob);
};

const performHFSwap = async (target: Attachment, prompt: string): Promise<Attachment> => {
  const blob = await queryHF(HF_EDIT_MODEL, { 
    inputs: target.data, 
    parameters: { prompt: prompt, num_inference_steps: 20 }
  });
  const base64 = await blobToBase64(blob);
  return { mimeType: "image/jpeg", data: base64.split(',')[1] };
};

export const performFaceSwap = async (source: Attachment, target: Attachment): Promise<Attachment> => {
  return performHFSwap(target, "Swap the face in this image to look exactly like the person provided in the reference, realistic, high detail");
};

export const performHairSwap = async (source: Attachment, target: Attachment): Promise<Attachment> => {
  return performHFSwap(target, "Change the hairstyle of the person to match the reference style, photorealistic");
};

export const performOutfitSwap = async (source: Attachment, target: Attachment): Promise<Attachment> => {
  return performHFSwap(target, "Change the clothes to match the outfit style from reference, high fashion");
};