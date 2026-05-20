
import React from 'react';

interface ScorePanelProps {
  score: number;
  highScore: number;
  combo: number;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ score, highScore, combo }) => {
  return (
    <div className="flex justify-between items-center mb-3 md:mb-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-6 py-2 md:py-3 shadow-lg min-w-[70px] md:min-w-[90px]">
        <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider text-center">Score</div>
        <div className="text-xl md:text-3xl font-bold text-green-600 text-center">{score}</div>
      </div>
      
      {combo > 0 && (
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl md:rounded-2xl px-3 md:px-6 py-2 md:py-3 shadow-lg animate-bounce min-w-[70px]">
          <div className="text-[10px] md:text-xs text-white font-bold uppercase tracking-wider text-center">Combo</div>
          <div className="text-xl md:text-3xl font-bold text-white text-center">x{combo}</div>
        </div>
      )}
      
      <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-6 py-2 md:py-3 shadow-lg min-w-[70px] md:min-w-[90px]">
        <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider text-center">Best</div>
        <div className="text-xl md:text-3xl font-bold text-orange-500 text-center">{highScore}</div>
      </div>
    </div>
  );
};
