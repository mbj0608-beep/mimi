import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, color = 'bg-blue-500', icon }) => {
  const boundedValue = Math.max(0, Math.min(100, value));
  
  let barColor = color;
  if (value < 30) barColor = 'bg-red-500';
  else if (value < 60) barColor = 'bg-yellow-500';
  else barColor = 'bg-green-500';

  if (label === '野性') barColor = 'bg-purple-500';

  return (
    <div className="w-full mb-1">
      <div className="flex justify-between text-xs text-gray-200 mb-0.5 font-bold shadow-black drop-shadow-md">
        <span className="flex items-center gap-1">{icon} {label}</span>
        <span>{Math.floor(boundedValue)}/100</span>
      </div>
      <div className="w-full bg-gray-900/60 rounded-full h-2.5 border border-gray-700 backdrop-blur-sm">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`} 
          style={{ width: `${boundedValue}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatBar;
