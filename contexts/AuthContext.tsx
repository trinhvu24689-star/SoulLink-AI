import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../types';

// Cấu hình IP máy Master (Backend)
const API_URL = 'http://192.168.1.7:3000/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => Promise<boolean>;
  register: (name: string, username: string, pass: string) => Promise<boolean>;
  logout: () => void;
  guestLogin: () => void;
  loading: boolean;
  addMoonShards: (amount: number) => void;
  spendMoonShards: (amount: number) => boolean;
  canGuestChat: () => { allowed: boolean; waitTime: number };
  recordGuestMessage: () => void;
  updateUser: (u: User) => void;
  setUser: (u: User) => void; // ✅ Đã thêm hàm này để fix lỗi AuthModal
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Guest Limits (Giữ nguyên logic giới hạn khách)
const LIMIT_DAY = 12;
const LIMIT_WEEK = 24;
const LIMIT_MONTH = 36;
const LIMIT_YEAR = 48;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Khôi phục phiên đăng nhập khi F5
  useEffect(() => {
    const storedUser = localStorage.getItem('soul_user');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Hàm set user chuẩn (Lưu cả vào localStorage)
  const setUser = (userData: User) => {
    setUserState(userData);
    localStorage.setItem('soul_user', JSON.stringify(userData));
  };

  const updateUser = (u: User) => {
    setUser(u); // Tận dụng hàm setUser ở trên
  };

  // --- KẾT NỐI SERVER BACKEND ---

  const login = async (username: string, pass: string): Promise<boolean> => {
    try {
      // Gọi API Backend
      const res = await axios.post(`${API_URL}/auth`, {
        username,
        password: pass,
        name: username, // Fallback name nếu login lần đầu
      });

      if (res.data) {
        setUser(res.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  };

  const register = async (name: string, username: string, pass: string): Promise<boolean> => {
    try {
      // Gọi API Backend với cờ pháp lý
      const res = await axios.post(`${API_URL}/auth`, {
        username,
        name,
        password: pass,
        isLegalAccepted: true
      });

      if (res.data) {
        setUser(res.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Register Error:", error);
      return false;
    }
  };

  // --- GUEST LOGIC (Client Side) ---

  const guestLogin = () => {
    const prevGuest = localStorage.getItem('soullink_guest_data');
    let guest: User;

    if (prevGuest) {
      guest = JSON.parse(prevGuest);
    } else {
      guest = { 
        id: 'guest_' + Date.now(), 
        name: 'Guest', 
        username: 'guest',
        email: 'guest@soullink.ai', 
        role: 'guest',
        moonShards: 0,
        badges: [],
        level: 0,
        msgCount: []
      };
    }
    setUser(guest);
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('soul_user');
  };

  const addMoonShards = (amount: number) => {
    if (!user) return;
    const updated = { ...user, moonShards: (user.moonShards || 0) + amount };
    updateUser(updated);
    // TODO: Gọi API /api/shop/purchase để đồng bộ server
  };

  const spendMoonShards = (amount: number): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; 
    if ((user.moonShards || 0) >= amount) {
      const updated = { ...user, moonShards: user.moonShards - amount };
      updateUser(updated);
      return true;
    }
    return false;
  };

  // Logic giới hạn chat cho khách
  const canGuestChat = (): { allowed: boolean; waitTime: number } => {
    if (!user || user.role !== 'guest') return { allowed: true, waitTime: 0 };
    
    const now = Date.now();
    const msgs = user.msgCount || [];
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;
    const recentMsgs = msgs.filter(t => t > oneYearAgo);

    const dayCount = recentMsgs.filter(t => t > now - 24 * 60 * 60 * 1000).length;
    const weekCount = recentMsgs.filter(t => t > now - 7 * 24 * 60 * 60 * 1000).length;
    const monthCount = recentMsgs.filter(t => t > now - 30 * 24 * 60 * 60 * 1000).length;
    const yearCount = recentMsgs.length;

    if (dayCount >= LIMIT_DAY) return { allowed: false, waitTime: (msgs[msgs.length - LIMIT_DAY] + 24*60*60*1000) - now };
    if (weekCount >= LIMIT_WEEK) return { allowed: false, waitTime: (msgs[msgs.length - LIMIT_WEEK] + 7*24*60*60*1000) - now };
    if (monthCount >= LIMIT_MONTH) return { allowed: false, waitTime: (msgs[msgs.length - LIMIT_MONTH] + 30*24*60*60*1000) - now };
    if (yearCount >= LIMIT_YEAR) return { allowed: false, waitTime: (msgs[msgs.length - LIMIT_YEAR] + 365*24*60*60*1000) - now };

    return { allowed: true, waitTime: 0 };
  };

  const recordGuestMessage = () => {
    if (!user || user.role !== 'guest') return;
    const updated = { ...user, msgCount: [...(user.msgCount || []), Date.now()] };
    setUser(updated); // Dùng hàm setUser mới để lưu cả vào localStorage
    localStorage.setItem('soullink_guest_data', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ 
        user, login, register, logout, guestLogin, loading, 
        addMoonShards, spendMoonShards, canGuestChat, recordGuestMessage, updateUser, 
        setUser // 👈 Quan trọng: Xuất hàm này ra để AuthModal dùng
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};