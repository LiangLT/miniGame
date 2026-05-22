interface SheepGameOverProps {
  victory: boolean;
  score: number;
  level: number;
  onRestart: () => void;
  onNextLevel?: () => void;
}

export function SheepGameOver({ victory, score, level, onRestart, onNextLevel }: SheepGameOverProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="
        bg-gradient-to-br from-white to-gray-100
        rounded-2xl md:rounded-3xl
        p-6 md:p-10
        max-w-sm w-full
        text-center
        shadow-2xl
        animate-bounce-in
      ">
        <div className="text-6xl md:text-8xl mb-4">
          {victory ? '🎉' : '😢'}
        </div>
        
        <h2 className={`
          text-2xl md:text-4xl font-bold mb-2
          ${victory ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500' : 'text-gray-700'}
        `}>
          {victory ? '恭喜通关！' : '游戏结束'}
        </h2>
        
        <p className="text-gray-500 mb-4">
          {victory ? `第 ${level} 关已完成` : `第 ${level} 关失败`}
        </p>
        
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl py-3 px-6 mb-6 inline-block">
          <p className="text-sm opacity-80">得分</p>
          <p className="text-3xl font-bold">{score}</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="
              w-full py-3 px-6
              bg-gradient-to-r from-indigo-500 to-purple-600
              text-white font-bold text-lg
              rounded-xl
              shadow-lg hover:shadow-xl
              transition-all duration-200
              hover:scale-105
            "
          >
            重新开始
          </button>
          
          {victory && onNextLevel && (
            <button
              onClick={onNextLevel}
              className="
                w-full py-3 px-6
                bg-gradient-to-r from-amber-400 to-orange-500
                text-white font-bold text-lg
                rounded-xl
                shadow-lg hover:shadow-xl
                transition-all duration-200
                hover:scale-105
              "
            >
              下一关
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
