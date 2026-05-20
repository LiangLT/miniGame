
import React from 'react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-4 md:p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="text-4xl md:text-6xl mb-3 md:mb-4">🎉</div>
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">Game Over!</h2>
        <p className="text-gray-600 mb-4 md:mb-6 text-sm">You did great!</p>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl md:rounded-2xl p-3 md:p-4 mb-3 md:mb-4">
          <div className="text-white/80 text-xs md:text-sm font-bold uppercase">Final Score</div>
          <div className="text-3xl md:text-5xl font-bold text-white">{score}</div>
        </div>
        
        <div className="text-gray-600 mb-4 md:mb-8 text-sm">
          Best: <span className="font-bold text-orange-500">{highScore}</span>
        </div>
        
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 active:from-orange-500 active:to-yellow-500 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl text-lg md:text-xl shadow-lg transition-transform duration-150 active:scale-95"
        >
          Play Again!
        </button>
      </div>
    </div>
  );
};
