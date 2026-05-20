import React from 'react';
import { useGame } from '../hooks/useGame';
import { GameBoard } from '../components/GameBoard';
import { ScorePanel } from '../components/ScorePanel';
import { GameOverScreen } from '../components/GameOverScreen';
import { LevelCompleteScreen } from '../components/LevelCompleteScreen';

export default function Home() {
  const {
    gameState,
    selectFruit,
    startDrawing,
    endDrawing,
    restartGame,
    nextLevel,
    restartLevel,
  } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 flex flex-col items-center justify-center p-2 md:p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-4 text-3xl md:text-8xl opacity-10 animate-bounce" style={{ animationDelay: '0s' }}>🍎</div>
        <div className="absolute top-16 right-4 md:right-20 text-2xl md:text-6xl opacity-10 animate-bounce" style={{ animationDelay: '0.5s' }}>🍊</div>
        <div className="absolute bottom-10 left-4 md:left-20 text-2xl md:text-7xl opacity-10 animate-bounce" style={{ animationDelay: '1s' }}>🍇</div>
        <div className="absolute bottom-20 right-4 md:right-10 text-xl md:text-5xl opacity-10 animate-bounce" style={{ animationDelay: '1.5s' }}>🍓</div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white text-center mb-1 md:mb-2 drop-shadow-lg">
          🍉 Fruit Slice 🍉
        </h1>
        <p className="text-white/70 text-center mb-3 md:mb-6 text-xs sm:text-sm md:text-lg">
          Connect 3+ fruits to slice them!
        </p>

        <ScorePanel
          score={gameState.score}
          highScore={gameState.highScore}
          combo={gameState.combo}
          level={gameState.level}
          targetScore={gameState.targetScore}
          timeRemaining={gameState.timeRemaining}
        />

        <div className="w-full" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <GameBoard
            grid={gameState.grid}
            selectedFruits={gameState.selectedFruits}
            isDrawing={gameState.isDrawing}
            onSelectFruit={selectFruit}
            onStartDrawing={startDrawing}
            onEndDrawing={endDrawing}
          />
        </div>

        <div className="mt-3 md:mt-6 text-center text-white/70 text-xs md:text-sm">
          <p>💡 Tip: Connect more fruits for higher scores!</p>
        </div>
      </div>

      {gameState.gameOver && (
        <GameOverScreen
          score={gameState.score}
          highScore={gameState.highScore}
          level={gameState.level}
          onRestart={restartGame}
          onReplay={restartLevel}
        />
      )}

      {gameState.levelComplete && (
        <LevelCompleteScreen
          level={gameState.level}
          score={gameState.score}
          onNextLevel={nextLevel}
          onRestart={restartLevel}
        />
      )}
    </div>
  );
}
