import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 1. QUAN TRỌNG: Phải import CSS thì Tailwind mới chạy (vì đã xóa CDN trong html)
import './index.css'; 

// 2. Debug Log: Để kiểm tra xem Code JS có chạy vào đây không
console.log('🚀 Ứng dụng đang khởi động...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("❌ Không tìm thấy thẻ root!");
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* LƯU Ý QUAN TRỌNG VỀ ROUTER:
       Nếu trong App.tsx bạn dùng 'BrowserRouter', hãy đổi thành 'HashRouter' 
       để chạy được trên Android (vì Android chạy file:// không có server).
    */}
    <App />
  </React.StrictMode>
);