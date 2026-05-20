import React from 'react';
import { useGame } from '../hooks/useGame';
import { GameBoard } from '../components/GameBoard';
import { ScorePanel } from '../components/ScorePanel';
import { GameOverScreen } from '../components/GameOverScreen';

export default function Home() {
  const { gameState, selectFruit, startDrawing, endDrawing, restartGame } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex flex-col items-center justify-center p-2 md:p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 text-4xl md:text-8xl opacity-15 animate-bounce" style={{ animationDelay: '0s' }}>🍎</div>
        <div className="absolute top-20 right-4 md:right-20 text-3xl md:text-6xl opacity-15 animate-bounce" style={{ animationDelay: '0.5s' }}>🍊</div>
        <div className="absolute bottom-12 left-4 md:left-20 text-3xl md:text-7xl opacity-15 animate-bounce" style={{ animationDelay: '1s' }}>🍇</div>
        <div className="absolute bottom-24 right-4 md:right-10 text-2xl md:text-5xl opacity-15 animate-bounce" style={{ animationDelay: '1.5s' }}>🍓</div>
      </div>

      <div className="relative z-10 w-full max-w-md md:max-w-lg">
        <h1 className="text-2xl md:text-5xl font-bold text-white text-center mb-2 drop-shadow-lg">
          🍉 Fruit Slice 🍉
        </h1>
        <p className="text-white/80 text-center mb-4 md:mb-8 text-sm md:text-lg">
          Connect 3+ fruits to slice them!
        </p>

        <ScorePanel
          score={gameState.score}
          highScore={gameState.highScore}
          combo={gameState.combo}
        />

        <div className="w-full">
          <GameBoard
            grid={gameState.grid}
            selectedFruits={gameState.selectedFruits}
            isDrawing={gameState.isDrawing}
            onSelectFruit={selectFruit}
            onStartDrawing={startDrawing}
            onEndDrawing={endDrawing}
          />
        </div>

        <div className="mt-3 md:mt-6 text-center text-white/80 text-xs md:text-sm">
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