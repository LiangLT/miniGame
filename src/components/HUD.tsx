import { GameState } from '../types/game';
import { COLORS } from '../utils/constants';

interface HUDProps {
  gameState: GameState;
}

export const HUD = ({ gameState }: HUDProps) => {
  const recentLog = gameState.actionLog[gameState.actionLog.length - 1] || '';

  return (
    <div className="flex flex-col gap-4 p-4 bg-dark-900 rounded-lg border-2 border-cyan-400" style={{ fontFamily: '"Press Start 2P", monospace' }}>
      <div className="text-xs text-yellow-400">
        <div className="flex justify-between gap-8 mb-2">
          <span style={{ color: COLORS.cyan }}>PLAYER 1</span>
          <span style={{ color: COLORS.magenta }}>PLAYER 2</span>
        </div>
        <div className="h-32 overflow-y-auto bg-black/50 p-2 rounded text-gray-300 text-[8px]">
          {gameState.actionLog.slice(-5).map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-400 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">P1:</span>
          <span>WASD: Move</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">P1:</span>
          <span>J: Attack</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-400">P1:</span>
          <span>K: Defend</span>
        </div>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <span className="text-magenta-400">P2:</span>
          <span>Arrow: Move</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-magenta-400">P2:</span>
          <span>1: Attack</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-magenta-400">P2:</span>
          <span>2: Defend</span>
        </div>
      </div>

      {recentLog && (
        <div className="text-xs text-yellow-400 p-2 bg-black/50 rounded">
          {recentLog}
        </div>
      )}
    </div>
  );
};
