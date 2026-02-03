import React, { useState } from 'react';
import { ASSETS } from '../constants';

interface StartScreenProps {
  onStart: (name: string, isAi: boolean, key: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [useAi, setUseAi] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleStart = () => {
    if (!name.trim()) return alert("请给小猫咪取个名字！");
    if (useAi && !apiKey.trim()) return alert("AI模式需要输入API Key！");
    onStart(name, useAi, apiKey);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white bg-black/80 z-20 relative">
      <div className="max-w-md w-full bg-stone-900/90 border border-stone-600 p-8 rounded-xl shadow-2xl backdrop-blur-md">
        <div className="flex justify-center mb-6">
           <img src={ASSETS.CAT_IMAGE} className="w-24 h-24 rounded-full border-2 border-stone-500 object-cover shadow-lg" alt="Logo" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-amber-500 tracking-wider">哈基米模拟器</h1>
        <h2 className="text-lg text-center mb-8 text-stone-400 font-serif">战火中的流浪日记</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1">给猫咪取名</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-stone-800 border border-stone-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white placeholder-stone-500"
              placeholder="例如：咪咪、奥利奥..."
            />
          </div>

          <div className="flex items-center gap-3 p-3 border border-stone-700 rounded-lg bg-stone-800/50">
            <input 
              type="checkbox" 
              id="aiMode" 
              checked={useAi} 
              onChange={(e) => setUseAi(e.target.checked)}
              className="w-5 h-5 text-amber-600 bg-gray-700 border-gray-600 rounded focus:ring-amber-600 ring-offset-gray-800"
            />
            <label htmlFor="aiMode" className="text-sm font-medium text-stone-300 cursor-pointer flex-1">
              启用 AI 导演模式 (更丰富的剧情)
            </label>
          </div>

          {useAi && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-stone-300 mb-1">Google Gemini API Key</label>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 bg-stone-800 border border-stone-600 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-white text-xs"
                placeholder="AI Studio API Key"
              />
              <p className="text-xs text-stone-500 mt-1">Key 仅用于当前会话，不会保存。</p>
            </div>
          )}

          <button 
            onClick={handleStart}
            className="w-full mt-6 py-3 px-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md transition-colors border border-amber-800"
          >
            开始流浪 (Day 1)
          </button>
        </div>
        
        <div className="mt-8 text-xs text-center text-stone-600">
            <p>即使在废墟中，生命依然顽强。</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
