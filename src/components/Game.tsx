import { useState, useEffect, useCallback } from 'react';
import { GameState } from '../types/game';
import { createInitialState, moveMech, attackMech, defendMech, endTurn, resetGame } from '../utils/gameEngine';
import { PLAYER1_KEYS, PLAYER2_KEYS } from '../utils/constants';
import { GameCanvas } from './GameCanvas';
import { VictoryScreen } from './VictoryScreen';
import { HUD } from './HUD';

export const Game = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [animationTimer, setAnimationTimer] = useState<number | null>(null);

  const handleAnimationComplete = useCallback(() => {
    if (gameState.gamePhase === 'playing' && gameState.isAnimating) {
      setGameState(prev => endTurn(prev));
    }
    setAnimationTimer(null);
  }, [gameState.gamePhase, gameState.isAnimating]);

  useEffect(() => {
    if (gameState.isAnimating && !animationTimer) {
      const timer = window.setTimeout(handleAnimationComplete, 500);
      setAnimationTimer(timer);
    }

    return () => {
      if (animationTimer) {
        clearTimeout(animationTimer);
      }
    };
  }, [gameState.isAnimating, animationTimer, handleAnimationComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gamePhase !== 'playing') return;
      if (gameState.isAnimating) return;

      const key = e.key.toLowerCase();

      if (gameState.currentTurn === 'player1') {
        switch (key) {
          case PLAYER1_KEYS.up:
            setGameState(prev => moveMech(prev, 0, -1));
            break;
          case PLAYER1_KEYS.down:
            setGameState(prev => moveMech(prev, 0, 1));
            break;
          case PLAYER1_KEYS.left:
            setGameState(prev => moveMech(prev, -1, 0));
            break;
          case PLAYER1_KEYS.right:
            setGameState(prev => moveMech(prev, 1, 0));
            break;
          case PLAYER1_KEYS.attack:
            setGameState(prev => attackMech(prev));
            break;
          case PLAYER1_KEYS.defend:
            setGameState(prev => defendMech(prev));
            break;
        }
      } else {
        switch (key) {
          case PLAYER2_KEYS.up:
            setGameState(prev => moveMech(prev, 0, -1));
            break;
          case PLAYER2_KEYS.down:
            setGameState(prev => moveMech(prev, 0, 1));
            break;
          case PLAYER2_KEYS.left:
            setGameState(prev => moveMech(prev, -1, 0));
            break;
          case PLAYER2_KEYS.right:
            setGameState(prev => moveMech(prev, 1, 0));
            break;
          case PLAYER2_KEYS.attack:
            setGameState(prev => attackMech(prev));
            break;
          case PLAYER2_KEYS.defend:
            setGameState(prev => defendMech(prev));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.currentTurn, gameState.gamePhase, gameState.isAnimating]);

  useEffect(() => {
    const animationFrame = window.setInterval(() => {
      setGameState(prev => ({
        ...prev,
        mech1: {
          ...prev.mech1,
          animationFrame: prev.mech1.animationFrame + 1,
        },
        mech2: {
          ...prev.mech2,
          animationFrame: prev.mech2.animationFrame + 1,
        },
      }));
    }, 100);

    return () => clearInterval(animationFrame);
  }, []);

  const handleRestart = () => {
    setGameState(resetGame());
  };

  return (
    <div className="flex gap-8 items-start">
      <GameCanvas gameState={gameState} />
      <HUD gameState={gameState} />
      {gameState.gamePhase === 'victory' && gameState.winner && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <VictoryScreen winner={gameState.winner} onRestart={handleRestart} />
        </div>
      )}
    </div>
  );
};
