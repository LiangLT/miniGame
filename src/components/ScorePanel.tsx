import React from 'react';

interface ScorePanelProps {
  score: number;
  highScore: number;
  combo: number;
  level: number;
  targetScore: number;
  timeRemaining: number;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  score,
  highScore,
  combo,
  level,
  targetScore,
  timeRemaining,
}) => {
  const progress = Math.min((score / targetScore) * 100, 100);
  const timeColor = timeRemaining <= 10 ? 'text-red-500' : timeRemaining <= 20 ? 'text-orange-500' : 'text-green-600';
  const timeBg = timeRemaining <= 10 ? 'bg-red-50' : timeRemaining <= 20 ? 'bg-orange-50' : 'bg-white/90';

  return (
    <div className="mb-3 md:mb-6 space-y-2">
      <div className="flex justify-between items-center gap-1">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-lg flex-1 min-w-0">
          <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Level</div>
          <div className="text-xl md:text-2xl font-bold text-green-600">{level}</div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-lg flex-1 min-w-0">
          <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Score</div>
          <div className="text-xl md:text-2xl font-bold text-green-600">{score}</div>
        </div>

        <div className={`${timeBg} backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-lg flex-1 min-w-0`}>
          <div className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Time</div>
          <div className={`text-xl md:text-2xl font-bold ${timeColor}`}>{timeRemaining}s</div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-4 py-2 shadow-lg">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">
            Target: {targetScore}
          </span>
          <span className="text-[10px] md:text-xs text-green-600 font-bold">
            {score}/{targetScore}
          </span>
        </div>
        <div className="h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {combo > 0 && (
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl md:rounded-2xl px-3 md:px-4 py-2 shadow-lg animate-bounce text-center">
          <div className="text-[10px] md:text-xs text-white font-bold uppercase tracking-wider">Combo</div>
          <div className="text-xl md:text-2xl font-bold text-white">x{combo}</div>
        </div>
      )}
    </div>
  );
};
