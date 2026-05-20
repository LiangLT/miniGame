
import React from 'react';

interface ScorePanelProps {
  score: number;
  highScore: number;
  combo: number;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ score, highScore, combo }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Score</div>
        <div className="text-3xl font-bold text-green-600">{score}</div>
      </div>
      
      {combo > 0 && (
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl px-6 py-3 shadow-lg animate-bounce">
          <div className="text-xs text-white font-bold uppercase tracking-wider">Combo</div>
          <div className="text-3xl font-bold text-white">x{combo}</div>
        </div>
      )}
      
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Best</div>
        <div className="text-3xl font-bold text-orange-500">{highScore}</div>
      </div>
    </div>
  );
};
