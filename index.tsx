import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 添加这行调试代码
console.log("🚀 哈基米游戏引擎正在启动...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("❌ 找不到 root 节点！");
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
