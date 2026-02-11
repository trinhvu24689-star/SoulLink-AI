
export type Language = 'en' | 'vi' | 'zh' | 'ja' | 'ko' | 'ru' | 'th' | 'hi';

export interface Attachment {
  mimeType: string;
  data: string; // Base64 string
}

export type UserRole = 'guest' | 'user' | 'ultra' | 'admin';

export interface User {
  id: string;
  name: string; // Display Name
  username: string; // Login ID
  email?: string; // Optional now
  avatar?: string;
  frame?: string; // Avatar Border Frame URL/Base64
  role: UserRole;
  moonShards: number; // Currency "Trăng Khuyết"
  badges: string[]; // "Ultra Vip", "Admin", etc.
  level: number;
  isBanned?: boolean;
  muteUntil?: number; // Timestamp
  msgCount?: number[]; // Timestamps of sent messages (for Guest limit)
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachment?: Attachment;
  timestamp: number;
}

export interface GlobalMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userAvatar?: string;
  userBadges: string[];
  text: string;
  type: 'text' | 'image' | 'red_envelope' | 'poll' | 'system';
  data?: any; // For red envelope amount or poll data
  timestamp: number;
}

export interface PersonaDetails {
  age: string;
  relationship: string;
  personality: string;
  tone: string;
  interests: string;
  memories: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  avatar: string;
  color: string;
  details?: PersonaDetails;
}

export interface ChatSession {
  id: string;
  title: string;
  personaId: string;
  messages: Message[];
  lastModified: number;
  preview: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  STREAMING = 'STREAMING',
  ERROR = 'ERROR',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  SWAPPING_FACE = 'SWAPPING_FACE',
  SWAPPING_HAIR = 'SWAPPING_HAIR',
  SWAPPING_OUTFIT = 'SWAPPING_OUTFIT'
}
