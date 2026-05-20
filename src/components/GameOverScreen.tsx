
import React from 'react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
        <p className="text-gray-600 mb-6">You did great!</p>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 mb-4">
          <div className="text-white/80 text-sm font-bold uppercase">Final Score</div>
          <div className="text-5xl font-bold text-white">{score}</div>
        </div>
        
        <div className="text-gray-600 mb-8">
          Best: <span className="font-bold text-orange-500">{highScore}</span>
        </div>
        
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Play Again!
        </button>
      </div>
    </div>
  );
};
