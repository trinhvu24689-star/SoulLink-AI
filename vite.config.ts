import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: './',
    
    // 👇 THÊM DÒNG NÀY: Bảo Vite "mở cửa" cho các biến bắt đầu bằng GEMINI_
    envPrefix: ['VITE_', 'GEMINI_', 'HUGGINGFACE_'], 

    build: {
      outDir: 'dist',
    },
    define: {
      'process.env': {}, // Giữ cái này để app không bị crash trên Android
    },
  };
});