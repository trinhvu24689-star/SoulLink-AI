import localforage from 'localforage';
import { ChatSession } from '../types';

const STORAGE_KEY = 'soullink_sessions';

// Cấu hình kho lưu trữ (IndexedDB)
localforage.config({
  driver: localforage.INDEXEDDB, // Bắt buộc dùng IndexedDB để lưu nhiều
  name: 'SoulLinkAI',
  version: 1.0,
  storeName: 'chat_history', 
  description: 'Lưu trữ toàn bộ lịch sử chat và hình ảnh'
});

// Lấy danh sách sessions
export const getSessions = async (): Promise<ChatSession[]> => {
  try {
    const stored = await localforage.getItem<ChatSession[]>(STORAGE_KEY);
    return stored || [];
  } catch (e) {
    console.error("Lỗi khi tải lịch sử:", e);
    return [];
  }
};

// Lưu session (Tự động cập nhật hoặc thêm mới)
export const saveSession = async (session: ChatSession) => {
  try {
    const sessions = await getSessions(); // Phải await để lấy dữ liệu cũ
    const index = sessions.findIndex(s => s.id === session.id);
    
    if (index >= 0) {
      sessions[index] = session; // Cập nhật
    } else {
      sessions.unshift(session); // Thêm mới lên đầu
    }
    
    // Giới hạn 50 cuộc hội thoại (Thoải mái vì IndexedDB rất lớn)
    if (sessions.length > 50) {
        sessions.length = 50; 
    }

    await localforage.setItem(STORAGE_KEY, sessions);
    console.log("Đã lưu session vào IndexedDB");
  } catch (e) {
    console.error("Lỗi khi lưu session:", e);
  }
};

// Xóa 1 session
export const deleteSession = async (id: string) => {
  try {
    const sessions = await getSessions();
    const newSessions = sessions.filter(s => s.id !== id);
    await localforage.setItem(STORAGE_KEY, newSessions);
  } catch (e) {
    console.error("Lỗi khi xóa session:", e);
  }
};

// Xóa tất cả
export const clearAllSessions = async () => {
  await localforage.removeItem(STORAGE_KEY);
};