import React from 'react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  level: number;
  onRestart: () => void;
  onReplay: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  level,
  onRestart,
  onReplay,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="text-5xl md:text-6xl mb-4">😢</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">时间到！</h2>
        <p className="text-gray-600 mb-4 text-sm md:text-base">你到达了第 {level} 关</p>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl md:rounded-2xl p-4 mb-3">
          <div className="text-white/80 text-xs md:text-sm font-bold uppercase">最终分数</div>
          <div className="text-3xl md:text-4xl font-bold text-white">{score}</div>
        </div>
        
        <div className="text-gray-600 mb-6 text-sm">
          最高分: <span className="font-bold text-orange-500">{highScore}</span>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onReplay}
            className="w-full bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-bold py-3 md:py-4 px-6 rounded-xl md:rounded-2xl text-base md:text-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            再试一次 🔄
          </button>
          
          <button
            onClick={onRestart}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 md:py-3 px-6 rounded-xl md:rounded-2xl text-sm md:text-base transition-all duration-200"
          >
            从第1关重新开始
          </button>
        </div>
      </div>
    </div>
  );
};
