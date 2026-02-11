import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  // 🔥 FIX 1: Đổi 'keyof typeof TRANSLATIONS.en' thành 'string'
  // Để Master có thể truyền bất kỳ từ khóa nào vào hàm t()
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');

  // 🔥 FIX 2: Cập nhật type của tham số key ở đây luôn
  const t = (key: string, params?: Record<string, string>): string => {
    
    // Ép kiểu (as any) để TypeScript không bắt bẻ việc truy cập key động
    const dict = (TRANSLATIONS as any)[language];
    
    // Fallback chain: Ngôn ngữ hiện tại -> Tiếng Anh -> Tên Key gốc
    let text = (dict && dict[key]) || 
               ((TRANSLATIONS as any)['en'] && (TRANSLATIONS as any)['en'][key]) || 
               key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, paramValue);
      });
    }
    return text as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};