import React from 'react';
import { useGame } from '../hooks/useGame';
import { GameBoard } from '../components/GameBoard';
import { ScorePanel } from '../components/ScorePanel';
import { GameOverScreen } from '../components/GameOverScreen';

export default function Home() {
  const { gameState, selectFruit, startDrawing, endDrawing, restartGame } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl opacity-20 animate-bounce" style={{ animationDelay: '0s' }}>🍎</div>
        <div className="absolute top-40 right-20 text-6xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>🍊</div>
        <div className="absolute bottom-20 left-20 text-7xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>🍇</div>
        <div className="absolute bottom-40 right-10 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '1.5s' }}>🍓</div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <h1 className="text-5xl font-bold text-white text-center mb-2 drop-shadow-lg">
          🍉 Fruit Slice 🍉
        </h1>
        <p className="text-white/80 text-center mb-8 text-lg">
          Connect 3+ fruits to slice them!
        </p>

        <ScorePanel
          score={gameState.score}
          highScore={gameState.highScore}
          combo={gameState.combo}
        />

        <GameBoard
          grid={gameState.grid}
          selectedFruits={gameState.selectedFruits}
          isDrawing={gameState.isDrawing}
          onSelectFruit={selectFruit}
          onStartDrawing={startDrawing}
          onEndDrawing={endDrawing}
        />

        <div className="mt-6 text-center text-white/80 text-sm">
          <p>💡 Tip: Connect more fruits for higher scores!</p>
        </div>
      </div>

      {gameState.gameOver && (
        <GameOverScreen
          score={gameState.score}
          highScore={gameState.highScore}
          onRestart={restartGame}
        />
      )}
    </div>
  );
}