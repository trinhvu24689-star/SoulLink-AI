import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Language } from '../types';
import { User, Bot, Copy, Check, Share2, ZoomIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatBubbleProps {
  message: Message;
  personaColor: string;
  personaAvatar?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, personaColor, personaAvatar }) => {
  const isUser = message.role === 'user';
  const { language } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);

  const getLocale = (lang: Language) => {
    const locales: Record<string, string> = {
      vi: 'vi-VN', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR', 
      ru: 'ru-RU', th: 'th-TH', hi: 'hi-IN', en: 'en-US'
    };
    return locales[lang] || 'en-US';
  };

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const renderAttachment = () => {
    if (!message.attachment) return null;
    const { mimeType, data } = message.attachment;
    const src = `data:${mimeType};base64,${data}`;

    return (
      <div className="group/media relative mb-3 rounded-xl overflow-hidden border border-white/10 shadow-inner bg-black/20">
        {mimeType.startsWith('video/') ? (
          <video controls className="max-w-full h-auto max-h-[400px] rounded-lg">
            <source src={src} type={mimeType} />
          </video>
        ) : (
          <div className="relative overflow-hidden">
            <img src={src} alt="SoulLink Media" className="max-w-full h-auto object-cover transition-transform duration-500 group-hover/media:scale-105" />
            <button className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-lg opacity-0 group-hover/media:opacity-100 transition-opacity">
              <ZoomIn size={16} className="text-white" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500 ease-out`}>
      <div className={`flex max-w-[92%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        
        {/* Avatar với hiệu ứng Ring màu Persona */}
        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg border-2 ${
          isUser ? 'bg-slate-800 border-slate-700' : 'border-transparent'
        }`} style={!isUser ? { borderColor: `${personaColor}44` } : {}}>
          {isUser ? (
            <User size={18} className="text-indigo-400" />
          ) : personaAvatar ? (
            <img src={personaAvatar} alt="Bot" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: personaColor }}>
              <Bot size={18} />
            </div>
          )}
        </div>

        {/* Bubble Content */}
        <div className="flex flex-col gap-1">
          <div className={`relative group px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 ${
            isUser
              ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-br-none'
              : 'bg-slate-800/60 backdrop-blur-xl border border-white/5 text-slate-100 rounded-bl-none hover:bg-slate-800/80'
          }`}>
            
            {renderAttachment()}

            {/* Markdown với Syntax Highlighting cho Code */}
            {message.text && (
              <div className="prose prose-invert prose-sm max-w-none leading-relaxed selection:bg-indigo-500/30">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="rounded-lg overflow-hidden my-2 border border-white/5">
                          <SyntaxHighlighter
                            style={atomDark as any}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className="bg-black/30 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[13px]" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            )}
            
            {/* Action Bar: hiện khi hover */}
            <div className={`absolute top-2 ${isUser ? '-left-10' : '-right-10'} flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                <button onClick={handleCopy} className="p-1.5 bg-slate-900/80 rounded-lg border border-white/5 text-slate-400 hover:text-white transition-colors">
                  {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
                <button className="p-1.5 bg-slate-900/80 rounded-lg border border-white/5 text-slate-400 hover:text-white transition-colors">
                  <Share2 size={14} />
                </button>
            </div>
          </div>

          {/* Timestamp */}
          <div className={`flex items-center px-1 text-[10px] font-medium tracking-tighter text-slate-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {new Date(message.timestamp).toLocaleTimeString(getLocale(language), { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;