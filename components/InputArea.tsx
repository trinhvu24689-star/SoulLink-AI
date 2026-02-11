
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Send, Paperclip, X, Mic, MicOff, Palette, FileVideo, Smile, Heart, Hand, Cat, Coffee, Zap } from 'lucide-react';
import { LoadingState, Language, Attachment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface InputAreaProps {
  onSendMessage: (text: string, attachment?: Attachment) => void;
  onOpenImageGen: () => void;
  loadingState: LoadingState;
}

// Categorized Emojis
const EMOJI_CATEGORIES = {
    faces: [
        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "wworried", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😮‍💨", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "mb", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🫢", "🫡", "🤫", "🫠", "🤥", "😶", "😶‍🌫️", "😐", "😑", "🫥", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖"
    ],
    love: [
        "❤️", "🩷", "🧡", "💛", "💚", "💙", "🩵", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "💌", "💋", "💄", "💍", "💎", "💐", "🌹", "🥀", "🌺", "🌷", "🪷", "🌸", "💮", "🏵️", "🌻", "🌼"
    ],
    gestures: [
        "👍", "👎", "👊", "✊", "🤛", "🤜", "🫷", "🫸", "🤞", "✌️", "🫰", "🤟", "🤘", "👌", "🤌", "🤏", "🫳", "🫴", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐️", "🖖", "👋", "🤙", "🫲", "🫱", "💪", "🦾", "🖕", "✍️", "🙏", "🫵", "🤝", "💅", "🦵", "🦶", "👂", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄"
    ],
    nature: [
        "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "cow", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "duck", "🦅", "🦉", "bat", "wolf", "boar", "horse", "unicorn", "🐝", "🪱", "🐛", "🦋", "🐌", "ladybug", "ant", "fly", "mosquito", "cricket", "spider", "web", "turtle", "snake", "lizard", "t-rex", "sauropod", "octopus", "squid", "shrimp", "lobster", "crab", "puffer", "shark", "fish", "dolphin", "whale", "croc", "leopard", "tiger2", "buffalo", "ox", "cow2", "deer", "goat", "camel", "lama", "elephant", "rhino", "hippo", "mammoth", "gorilla", "orangutan", "sloth", "otter", "skunk", "badger", "cock", "turkey", "dodo", "peacock", "parrot", "swan", "flamingo", "dove", "rabbit2", "racoon", "beaver", "seal", "dog2", "poodle", "guide", "service", "cat2", "blackcat", "feather", "rooster", "palm", "cactus", "herb", "shamrock", "clover", "maple", "fallen", "leaf", "mushroom", "shell", "coral", "rock", "wood", "fire", "water", "cloud", "sun", "moon", "star"
    ],
    objects: [
        "☕", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🫗", "🥤", "🧋", "🧃", "🧉", "🧊", "🥢", "🍽️", "🍴", "🥄", "🔪", "🏺", "🌍", "🌎", "🌏", "🌐", "🗺️", "🗾", "🧭", "🏔️", "⛰️", "🌋", "🗻", "🏕️", "🏖️", "🏜️", "🏝️", "🏞️", "🏟️", "🏛️", "🏗️", "🧱", "🪨", "🪵", "🛖", "🏘️", "🏚️", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "🕌", "🛕", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁", "🌃", "🏙️", "🌄", "🌅", "🌆", "🌇", "🌉", "🎠", "🎡", "🎢", "💈", "🎪", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔", "🚕", "🚖", "🚗", "🚘", "🚙", "🛻", "🚚", "🚛", "🚜", "🏎️", "🏍️", "🛵", "🦽", "🦼", "🛺", "🚲", "🛴", "🛹", "🛼", "🚏", "🛣️", "🛤️", "🛢️", "⛽", "🚨", "🚥", "🚦", "🛑", "🚧", "⚓", "⛵", "🛶", "🚤", "🛳️", "⛴️", "🛥️", "🚢", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🛰️", "🚀", "🛸", "🪐", "🌠", "🌌", "⛱️", "🎆", "🎇", "🧨", "✨", "🎈", "🎉", "🎊", "🎋", "🎍", "🎎", "🎏", "🎐", "🎑", "🧧", "🎀", "🎁", "🎗️", "🎟️", "🎫", "🎖️", "🏆", "🏅", "🥇", "🥈", "🥉", "⚽", "⚾", "🥎", "🏀", "🏐", "🏈", "🏉", "🎾", "🥏", "🎳", "🏏", "🏑", "🏒", "🥍", "🏓", "🏸", "🥊", "🥋", "🥅", "⛳", "⛸️", "🎣", "🤿", "🎽", "🎿", "🛷", "🥌", "🎯", "🪀", "🪁", "🎱", "🔮", "🪄", "🧿", "🎮", "🕹️", "🎰", "🎲", "🧩", "🧸", "🪅", "🪩", "🪆", "🃏", "🀄", "🎴", "🎭", "🖼️", "🎨", "🧵", "🪡", "🧶", "🪢", "👓", "🕶️", "🥽", "🥼", "🦺", "👔", "👕", "👖", "🧣", "🧤", "🧥", "🧦", "👗", "👘", "🥻", "🩱", "🩲", "🩳", "👙", "👚", "👛", "👜", "👝", "🛍️", "🎒", "🩴", "👞", "👟", "🥾", "🥿", "👠", "👡", "🩰", "👢", "👑", "👒", "🎩", "🎓", "🧢", "🪖", "⛑️", "📿", "💄", "💍", "💎", "🔇", "🔈", "🔉", "🔊", "📢", "📣", "📯", "🔔", "🔕", "🎼", "🎵", "🎶", "🎙️", "🎚️", "🎛️", "🎤", "🎧", "📻", "🎷", "🪗", "🎸", "🎹", "🎺", "🎻", "🪕", "🥁", "🪘", "📱", "📲", "☎️", "📞", "📟", "📠", "🔋", "🪫", "🔌", "💻", "🖥️", "🖨️", "⌨️", "🖱️", "🖲️", "💽", "💾", "💿", "📀", "🧮", "🎥", "🎞️", "📽️", "🎬", "📺", "📷", "📸", "📹", "📼", "🔍", "🔎", "🕯️", "💡", "🔦", "🏮", "🪔", "📔", "📕", "📖", "📗", "📘", "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞️", "📑", "🔖", "🏷️", "💰", "🪙", "💴", "💵", "💶", "💷", "💸", "💳", "🧾", "💹", "✉️", "📧", "📨", "📩", "📤", "📥", "📦", "📫", "📪", "📬", "📭", "📮", "🗳️", "✏️", "✒️", "🖋️", "🖊️", "🖌️", "🖍️", "📝", "💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "🔨", "🪓", "⛏️", "⚒️", "🛠️", "🗡️", "⚔️", "🔫", "🪃", "🏹", "🛡️", "🪚", "🔧", "🪛", "🔩", "⚙️", "🗜️", "⚖️", "🦯", "🔗", "⛓️", "🪝", "🧰", "🧲", "🪜", "⚗️", "🧪", "🧫", "🧬", "🔬", "🔭", "📡", "💉", "🩸", "💊", "🩹", "🩼", "🩺", "🩻", "🚪", "🛗", "🪞", "🪟", "🛏️", "🛋️", "🪑", "🚽", "🪠", "🚿", "🛁", "🪤", "🪒", "🧴", "🧷", "🧹", "🧺", "🧻", "🪣", "🧼", "🫧", "🪥", "🧽", "🧯", "🛒", "🚬", "⚰️", "🪦", "⚱️", "🏺", "🧿", "🪬", "🗿", "🪧", "🪪"
    ]
};

type EmojiCategory = keyof typeof EMOJI_CATEGORIES;

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, onOpenImageGen, loadingState }) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isListening, setIsListening] = useState(false);
  const { t, language } = useLanguage();
  const [showEmojis, setShowEmojis] = useState(false);
  const [activeEmojiTab, setActiveEmojiTab] = useState<EmojiCategory>('faces');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const getSpeechLang = (lang: Language) => {
    switch (lang) {
      case 'vi': return 'vi-VN';
      case 'zh': return 'zh-CN';
      case 'ja': return 'ja-JP';
      case 'ko': return 'ko-KR';
      case 'ru': return 'ru-RU';
      case 'th': return 'th-TH';
      case 'hi': return 'hi-IN';
      case 'en': 
      default: return 'en-US';
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      // Set language dynamically
      recognitionRef.current.lang = getSpeechLang(language);
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setText(prev => {
             const newText = prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript;
             return newText;
          });
        }
      };

      recognitionRef.current.onend = () => {
         setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, [language]); // Re-init if language changes

  // Auto-resize textarea when text changes
  useEffect(() => {
     if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
     }
  }, [text]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(t('micError'));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        // Ensure lang is correct before starting
        recognitionRef.current.lang = getSpeechLang(language);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting recognition", e);
      }
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result includes "data:mime;base64,..."
        const result = reader.result as string;
        // Extract raw base64 and mime type
        const parts = result.split(',');
        const mimeMatch = result.match(/data:([^;]+);/);
        
        if (parts.length === 2 && mimeMatch) {
            setAttachment({
                mimeType: mimeMatch[1],
                data: parts[1]
            });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if ((!text.trim() && !attachment) || loadingState !== LoadingState.IDLE) return;
    
    if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
    }

    onSendMessage(text, attachment || undefined);
    setText('');
    setAttachment(null);
    setShowEmojis(false);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
  }

  const isLoading = loadingState !== LoadingState.IDLE;

  // Tabs Configuration
  const tabs = [
    { id: 'faces', icon: <Smile size={18} /> },
    { id: 'love', icon: <Heart size={18} /> },
    { id: 'gestures', icon: <Hand size={18} /> },
    { id: 'nature', icon: <Cat size={18} /> },
    { id: 'objects', icon: <Zap size={18} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 z-50">
      <div className="max-w-3xl mx-auto relative">
        {showEmojis && (
            <div className="absolute bottom-full left-0 mb-3 bg-slate-800/95 backdrop-blur-xl border border-slate-700 p-2 rounded-2xl shadow-2xl w-full max-w-[360px] animate-fade-in-up flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-slate-700/50 pb-2 mb-2 gap-1 overflow-x-auto scrollbar-hide px-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveEmojiTab(tab.id as EmojiCategory)}
                            className={`p-2 rounded-xl transition-all flex-shrink-0 ${activeEmojiTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                        >
                            {tab.icon}
                        </button>
                    ))}
                </div>
                
                {/* Emoji Grid */}
                <div className="grid grid-cols-8 gap-1 h-56 overflow-y-auto custom-scrollbar content-start p-1">
                    {EMOJI_CATEGORIES[activeEmojiTab].map((e, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setText(prev => prev + e)} 
                            className="text-2xl hover:bg-slate-700 rounded-lg p-1 transition-transform active:scale-90 flex items-center justify-center aspect-square"
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {attachment && (
          <div className="mb-2 relative inline-block animate-fade-in">
            {attachment.mimeType.startsWith('video/') ? (
                <div className="h-24 w-32 bg-black rounded-xl border border-slate-700 flex items-center justify-center">
                    <FileVideo size={32} className="text-white" />
                </div>
            ) : (
                <img src={`data:${attachment.mimeType};base64,${attachment.data}`} alt="Preview" className="h-24 w-auto rounded-xl border border-slate-700 shadow-lg object-cover" />
            )}
            
            <button
              onClick={() => { setAttachment(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 text-white hover:bg-red-600 transition shadow-md border-2 border-slate-900"
            >
              <X size={12} />
            </button>
          </div>
        )}
        
        <div className="flex items-end gap-2 bg-slate-800 p-2 rounded-[2rem] border border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all shadow-xl">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*,image/gif"
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded-full transition-colors"
            title={t('uploadImage')}
          >
            <Paperclip size={22} />
          </button>
          
          <button
            onClick={onOpenImageGen}
            className="p-3 text-slate-400 hover:text-purple-400 hover:bg-slate-700/50 rounded-full transition-colors hidden sm:block"
            title={t('generateImageBtn')}
          >
            <Palette size={22} />
          </button>

          <button
            onClick={() => setShowEmojis(!showEmojis)}
            className={`p-3 rounded-full transition-colors ${showEmojis ? 'text-yellow-400 bg-slate-700/50' : 'text-slate-400 hover:text-yellow-400 hover:bg-slate-700/50'}`}
          >
            <Smile size={22} />
          </button>

          <button
             onClick={toggleListening}
             className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50'}`}
             title={isListening ? t('listening') : t('listening')} 
          >
             {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={adjustTextareaHeight}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? t('listening') : t('placeholder')}
            className="flex-1 bg-transparent text-white placeholder-slate-500 resize-none outline-none py-3 px-2 max-h-32 min-h-[44px]"
            rows={1}
          />

          <button
            onClick={handleSend}
            disabled={isLoading || (!text.trim() && !attachment)}
            className={`p-3 rounded-full flex items-center justify-center transition-all ${
              isLoading || (!text.trim() && !attachment)
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
            }`}
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
            ) : (
                <Send size={20} className="ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
