import React from 'react';
import { GameEvent, EventChoice } from '../types';

interface EventModalProps {
  event: GameEvent;
  result: string | null;
  onChoice: (choice: EventChoice) => void;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, result, onChoice, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-stone-900 border-2 border-stone-600 rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-stone-800 border-b border-stone-700">
          <h3 className="text-xl font-bold text-amber-500">{result ? '事件结果' : event.title}</h3>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-stone-200 text-lg leading-relaxed whitespace-pre-line font-serif">
            {result ? result : event.description}
          </p>
        </div>

        {/* Actions */}
        <div className="p-5 bg-stone-800 border-t border-stone-700 flex flex-col gap-3">
          {!result ? (
            // Show Choices
            event.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => onChoice(choice)}
                className="w-full py-3 px-4 text-left bg-stone-700 hover:bg-stone-600 text-stone-100 rounded-lg border border-stone-500 transition-all active:scale-[0.98] group"
              >
                <div className="font-bold text-amber-400 mb-1 group-hover:text-amber-300">
                  {String.fromCharCode(65 + idx)}. {choice.text}
                </div>
              </button>
            ))
          ) : (
            // Show Close Button
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-lg border border-amber-800 transition-all active:scale-[0.95]"
            >
              继续流浪
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
