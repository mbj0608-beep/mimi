import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 必须加上这一行，mimi 是你的仓库名
  base: '/mimi/',
  plugins: [react()],
});
