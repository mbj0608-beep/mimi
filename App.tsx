import React, { useState, useEffect, useRef } from 'react';
import StartScreen from './components/StartScreen';
import StatBar from './components/StatBar';
import EventModal from './components/EventModal';
import { generateStoryEvent } from './services/geminiService';
import { ASSETS, DEFAULT_RADIO, INITIAL_STATS, OFFLINE_EVENTS, RADIO_SCRIPTS } from './constants';
import { CatStats, EventChoice, GameEvent, GamePhase, GameState, DailyActions } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.START,
    day: 1,
    catName: '',
    stats: { ...INITIAL_STATS },
    logs: ['你睁开了眼睛。周围是破碎的瓦砾。肚子有点饿了。'],
    dailyActions: { forage: 0, rest: 0, ponder: 0, radio: 0 },
    radioListened: false,
    isAiMode: false,
    apiKey: '',
  });

  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [eventResult, setEventResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [radioContent, setRadioContent] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameState.logs]);

  // Check Game Over / Win conditions
  useEffect(() => {
    if (gameState.phase !== GamePhase.PLAYING) return;

    const { health, hunger, mood } = gameState.stats;
    let reason = '';
    
    if (health <= 0) reason = '你的身体再也支撑不住了，在寒风中永远睡着了。';
    else if (hunger <= 0) reason = '饥饿吞噬了你最后的意识。';
    else if (mood <= 0) reason = '绝望压垮了你的意志，你不再想动弹。';

    if (reason) {
      setGameState(prev => ({ ...prev, phase: GamePhase.ENDING, gameOverReason: reason, isWin: false }));
      return;
    }

    if (gameState.day > 30) {
      setGameState(prev => ({ ...prev, phase: GamePhase.ENDING, isWin: true }));
    }
  }, [gameState.stats, gameState.day, gameState.phase]);

  const addLog = (text: string) => {
    setGameState(prev => ({ ...prev, logs: [...prev.logs, `Day ${prev.day}: ${text}`] }));
  };

  const updateStats = (changes: Partial<CatStats>) => {
    setGameState(prev => {
      const newStats = { ...prev.stats };
      (Object.keys(changes) as Array<keyof CatStats>).forEach(key => {
        newStats[key] = Math.max(0, Math.min(100, newStats[key] + (changes[key] || 0)));
      });
      return { ...prev, stats: newStats };
    });
  };

  const handleStartGame = (name: string, isAi: boolean, key: string) => {
    setGameState({
      ...gameState,
      phase: GamePhase.PLAYING,
      catName: name,
      isAiMode: isAi,
      apiKey: key,
      day: 1,
      stats: { ...INITIAL_STATS },
      dailyActions: { forage: 0, rest: 0, ponder: 0, radio: 0 },
      logs: [`${name} 苏醒了。战争还在继续，你需要活下去。`],
    });
  };

  const checkActionLimit = (actionType: keyof DailyActions): boolean => {
    const limits: Record<keyof DailyActions, number> = {
      forage: 3,
      rest: 1,
      ponder: 1,
      radio: 1
    };
    
    if (gameState.dailyActions[actionType] >= limits[actionType]) {
      addLog(`(体力不足) 今天已经做过太多次这件事了，明天再说吧。`);
      return false;
    }
    return true;
  };

  const incrementActionCount = (actionType: keyof DailyActions) => {
    setGameState(prev => ({
      ...prev,
      dailyActions: {
        ...prev.dailyActions,
        [actionType]: prev.dailyActions[actionType] + 1
      }
    }));
  };

  const triggerEvent = async (actionLabel: string, actionType: keyof DailyActions) => {
    if (!checkActionLimit(actionType)) return;

    setLoading(true);
    let event: GameEvent;

    if (gameState.isAiMode && gameState.apiKey) {
      try {
        event = await generateStoryEvent(gameState.apiKey, gameState.day, actionLabel, gameState.stats, gameState.catName);
      } catch (e) {
        // Fallback to offline events on error
        const pool = OFFLINE_EVENTS;
        event = pool[Math.floor(Math.random() * pool.length)];
      }
    } else {
      // Offline Logic
      // Filter events based on action hint if we categorized them, but for now random selection
      // We can make it slightly smarter by filtering IDs if we implemented tagging
      const pool = OFFLINE_EVENTS;
      
      // Temporary simple filtering or direct assignment for specific actions
      if (actionType === 'rest') {
         event = OFFLINE_EVENTS.find(e => e.id === 'rest_dream') || pool[0];
      } else if (actionType === 'ponder') {
         // Try to find environment/thought events
         const ponderPool = pool.filter(e => e.id.startsWith('e_') || e.id.startsWith('h_'));
         event = ponderPool[Math.floor(Math.random() * ponderPool.length)] || pool[Math.floor(Math.random() * pool.length)];
      } else {
         // Forage gets everything else mostly
         const foragePool = pool.filter(e => !e.id.startsWith('rest'));
         event = foragePool[Math.floor(Math.random() * foragePool.length)] || pool[0];
      }
    }
    
    incrementActionCount(actionType);
    setCurrentEvent(event);
    setLoading(false);
    setGameState(prev => ({ ...prev, phase: GamePhase.EVENT }));
  };

  const handleEventChoice = (choice: EventChoice) => {
    updateStats(choice.statChanges);
    // Display result in modal instead of closing immediately
    setEventResult(choice.effectDescription);
    addLog(`${currentEvent?.title} -> ${choice.text}`);
    
    // Natural Decay after an action
    updateStats({ hunger: -5, stamina: -2 });

    // Check for choice-based death immediately
    if (choice.isDeath) {
       setGameState(prev => ({ 
         ...prev, 
         phase: GamePhase.ENDING, 
         gameOverReason: '你在这次事件中不幸丧生。', 
         isWin: false 
       }));
       // If dead, we might want to close modal or handle differently, but ENDING phase overlay covers it
       setCurrentEvent(null);
       setEventResult(null);
    }
  };

  const closeEventModal = () => {
    setCurrentEvent(null);
    setEventResult(null);
    setGameState(prev => ({ ...prev, phase: GamePhase.PLAYING }));
  };

  const handleRadio = () => {
    if (!checkActionLimit('radio')) return;

    if (gameState.radioListened) {
      addLog("你已经听过今天的广播了。只有沙沙的电流声。");
      return;
    }

    const script = RADIO_SCRIPTS[gameState.day] || DEFAULT_RADIO;
    setRadioContent(script);
    addLog(`收听电台: ${script}`);
    setGameState(prev => ({ ...prev, radioListened: true }));
    updateStats({ mood: 5 }); 
    incrementActionCount('radio');
  };

  const handleNextDay = () => {
    setGameState(prev => ({
      ...prev,
      day: prev.day + 1,
      radioListened: false,
      dailyActions: { forage: 0, rest: 0, ponder: 0, radio: 0 }, // Reset counts
      stats: {
        ...prev.stats,
        hunger: Math.max(0, prev.stats.hunger - 15), 
        stamina: Math.max(0, prev.stats.stamina - 5),
      }
    }));
    addLog("--- 夜晚过去了，新的一天开始了 ---");
  };

  const getEndingText = () => {
    if (!gameState.isWin) return gameState.gameOverReason;
    
    const { wildness, trust } = gameState.stats;
    if (wildness > 80) return "战争结束了。你活了下来，但你已经不再相信人类。你成为了一只孤独的荒野之王，消失在城市的阴影中。";
    if (trust > 80) return "战争结束了。那个经常喂你的好心人找到了你，把你抱回了重建的家。你再次拥有了温暖的垫子和罐头。";
    return "战争结束了。你活了下来，带着这一身的伤痕和记忆。你是一只见过地狱的猫，这让你无比珍惜此刻的阳光。";
  };

  if (gameState.phase === GamePhase.START) {
    return <StartScreen onStart={handleStartGame} />;
  }

  return (
    <div className="relative min-h-screen bg-stone-900 text-stone-100 font-sans overflow-hidden select-none">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 grayscale contrast-125"
        style={{ backgroundImage: `url(${ASSETS.BG_IMAGE})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-900/90" />

      {/* Main UI */}
      <div className="relative z-10 max-w-lg mx-auto h-screen flex flex-col">
        
        {/* Header */}
        <div className="p-4 flex justify-between items-end bg-gradient-to-b from-black/80 to-transparent">
          <div>
            <h2 className="text-3xl font-bold text-amber-500 font-mono tracking-widest">DAY {gameState.day}</h2>
            <p className="text-xs text-stone-400">距离停火还有 {30 - gameState.day} 天</p>
          </div>
          <div className="text-right">
             <div className="text-lg font-bold text-white drop-shadow-md">{gameState.catName}</div>
             <div className="text-xs text-stone-400">状态: {gameState.stats.health > 50 ? '良好' : '虚弱'}</div>
          </div>
        </div>

        {/* Action Area & Visual */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 relative">
          
          {/* Cat Avatar */}
          <div className="relative w-48 h-48 mb-6 group">
            <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <img 
              src={ASSETS.CAT_IMAGE} 
              alt="Cat" 
              className={`w-full h-full object-cover rounded-full border-4 shadow-2xl transition-all duration-500 ${gameState.stats.health < 30 ? 'border-red-800 grayscale' : 'border-stone-500'}`}
            />
            {loading && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full backdrop-blur-sm">
                 <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-4">
             <button 
                disabled={loading}
                onClick={() => triggerEvent('外出觅食', 'forage')}
                className="bg-stone-800/90 hover:bg-amber-800/80 border border-stone-600 text-amber-100 py-3 rounded-lg shadow-lg backdrop-blur-sm font-bold transition-all transform active:scale-95 disabled:opacity-50 flex flex-col items-center"
             >
               <span>🐟 外出觅食</span>
               <span className="text-[10px] text-stone-400 font-normal">({3 - gameState.dailyActions.forage}/3)</span>
             </button>
             <button 
                disabled={loading}
                onClick={() => triggerEvent('休息', 'rest')}
                className="bg-stone-800/90 hover:bg-blue-900/80 border border-stone-600 text-blue-100 py-3 rounded-lg shadow-lg backdrop-blur-sm font-bold transition-all transform active:scale-95 disabled:opacity-50 flex flex-col items-center"
             >
               <span>💤 休息</span>
               <span className="text-[10px] text-stone-400 font-normal">({1 - gameState.dailyActions.rest}/1)</span>
             </button>
             <button 
                disabled={loading}
                onClick={() => triggerEvent('思考喵生', 'ponder')}
                className="bg-stone-800/90 hover:bg-purple-900/80 border border-stone-600 text-purple-100 py-3 rounded-lg shadow-lg backdrop-blur-sm font-bold transition-all transform active:scale-95 disabled:opacity-50 flex flex-col items-center"
             >
               <span>🧶 思考喵生</span>
               <span className="text-[10px] text-stone-400 font-normal">({1 - gameState.dailyActions.ponder}/1)</span>
             </button>
             <button 
                disabled={loading || gameState.radioListened}
                onClick={handleRadio}
                className={`bg-stone-800/90 border border-stone-600 py-3 rounded-lg shadow-lg backdrop-blur-sm font-bold transition-all transform active:scale-95 flex flex-col items-center ${gameState.radioListened ? 'text-stone-600 cursor-not-allowed' : 'hover:bg-green-900/80 text-green-100'}`}
             >
               <span>📻 收音机</span>
               <span className="text-[10px] font-normal">{gameState.radioListened ? '(已听)' : '(0/1)'}</span>
             </button>
          </div>
          
          <button 
            onClick={handleNextDay}
            className="w-full max-w-xs bg-red-900/80 hover:bg-red-800 text-red-100 py-2 rounded border border-red-700 font-serif text-sm tracking-widest mb-2"
          >
            结束这一天 &gt;&gt;
          </button>
        </div>

        {/* Stats Panel */}
        <div className="bg-black/60 backdrop-blur-md p-4 rounded-t-2xl border-t border-stone-800">
           <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <StatBar label="健康" value={gameState.stats.health} color="bg-red-600" />
              <StatBar label="饱腹" value={gameState.stats.hunger} color="bg-orange-500" />
              <StatBar label="体力" value={gameState.stats.stamina} color="bg-blue-500" />
              <StatBar label="心情" value={gameState.stats.mood} color="bg-pink-500" />
              <StatBar label="信任" value={gameState.stats.trust} color="bg-green-500" />
              <StatBar label="野性" value={gameState.stats.wildness} color="bg-purple-500" />
           </div>
        </div>

        {/* Log Area */}
        <div 
          ref={scrollRef}
          className="h-64 overflow-y-auto p-4 bg-stone-950/90 text-sm text-stone-400 font-mono border-t border-stone-800 shadow-inner"
        >
          {gameState.logs.map((log, idx) => (
            <div key={idx} className="mb-2 border-l-2 border-stone-700 pl-2 leading-relaxed">{log}</div>
          ))}
        </div>
      </div>

      {/* Overlays */}
      {gameState.phase === GamePhase.EVENT && currentEvent && (
        <EventModal 
          event={currentEvent} 
          result={eventResult}
          onChoice={handleEventChoice} 
          onClose={closeEventModal}
        />
      )}

      {radioContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur" onClick={() => setRadioContent(null)}>
           <div className="bg-stone-800 p-6 rounded-lg max-w-sm border border-green-800 shadow-[0_0_50px_rgba(0,255,0,0.1)]" onClick={e => e.stopPropagation()}>
              <h3 className="text-green-500 font-mono text-xl mb-4 animate-pulse">📻 FM 自由之声</h3>
              <p className="text-green-100 font-serif leading-loose">{radioContent}</p>
              <button className="mt-6 w-full py-2 bg-stone-700 text-stone-300 rounded hover:bg-stone-600" onClick={() => setRadioContent(null)}>关闭</button>
           </div>
        </div>
      )}

      {gameState.phase === GamePhase.ENDING && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black text-center animate-fade-in">
           <h1 className={`text-4xl font-bold mb-4 ${gameState.isWin ? 'text-amber-500' : 'text-stone-500'}`}>
             {gameState.isWin ? '幸存' : '死亡'}
           </h1>
           <div className="max-w-md text-stone-300 text-lg leading-relaxed mb-8 font-serif">
             {getEndingText()}
           </div>
           <button 
             onClick={() => window.location.reload()}
             className="px-8 py-3 bg-stone-100 text-black font-bold rounded-full hover:bg-stone-300 transition-colors"
           >
             再次轮回
           </button>
        </div>
      )}
    </div>
  );
}

export default App;
