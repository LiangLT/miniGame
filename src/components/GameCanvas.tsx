import { useEffect, useRef } from 'react';
import { GameState } from '../types/game';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';
import { drawBackground, drawMech, drawHealthBar } from '../utils/pixelRenderer';

interface GameCanvasProps {
  gameState: GameState;
}

export const GameCanvas = ({ gameState }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBackground(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawMech(ctx, gameState.mech1, true);
    drawMech(ctx, gameState.mech2, false);

    drawHealthBar(ctx, 20, 10, gameState.mech1.health, gameState.mech1.maxHealth, true);
    drawHealthBar(ctx, CANVAS_WIDTH - 140, 10, gameState.mech2.health, gameState.mech2.maxHealth, false);

    ctx.fillStyle = '#FFFF00';
    ctx.font = '10px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText(
      gameState.currentTurn === 'player1' ? 'Player 1 Turn' : 'Player 2 Turn',
      CANVAS_WIDTH / 2,
      580
    );
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-4 border-cyan-400 pixel-shadow"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};
