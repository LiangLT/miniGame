import { COLORS } from '../utils/constants';

interface VictoryScreenProps {
  winner: 'player1' | 'player2';
  onRestart: () => void;
}

export const VictoryScreen = ({ winner, onRestart }: VictoryScreenProps) => {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/80"
      style={{ fontFamily: '"Press Start 2P", monospace' }}
    >
      <h1
        className="text-3xl mb-8 animate-pulse"
        style={{ color: winner === 'player1' ? COLORS.cyan : COLORS.magenta }}
      >
        PLAYER {winner === 'player1' ? '1' : '2'} WINS!
      </h1>
      <button
        onClick={onRestart}
        className="px-8 py-4 text-yellow-400 border-4 border-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200"
        style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
      >
        PLAY AGAIN
      </button>
    </div>
  );
};
