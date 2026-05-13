import { Mech } from '../types/game';
import { TILE_SIZE, COLORS } from './constants';

const MECH_SIZE = 3;

export const drawPixelRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
): void => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
};

export const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.strokeStyle = COLORS.lightGray;
  ctx.lineWidth = 1;
  
  for (let x = 0; x <= width; x += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  for (let y = 0; y <= height; y += TILE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

export const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.fillStyle = COLORS.darkBlue;
  ctx.fillRect(0, 0, width, height);
  
  for (let x = 0; x < width; x += TILE_SIZE) {
    for (let y = 0; y < height; y += TILE_SIZE) {
      const noise = Math.random() > 0.9 ? COLORS.lightGray : COLORS.gray;
      drawPixelRect(ctx, x, y, TILE_SIZE, TILE_SIZE, noise);
    }
  }
  
  drawGrid(ctx, width, height);
};

export const drawMech = (ctx: CanvasRenderingContext2D, mech: Mech, isPlayer1: boolean): void => {
  const px = mech.x * TILE_SIZE + (TILE_SIZE - MECH_SIZE * 8) / 2;
  const py = mech.y * TILE_SIZE + (TILE_SIZE - MECH_SIZE * 10) / 2;
  
  const mainColor = isPlayer1 ? COLORS.cyan : COLORS.magenta;
  const accentColor = isPlayer1 ? COLORS.magenta : COLORS.cyan;
  
  const frame = mech.animationFrame % 4;
  
  ctx.imageSmoothingEnabled = false;
  
  drawPixelRect(ctx, px + 8, py, 8, 4, accentColor);
  
  drawPixelRect(ctx, px + 4, py + 4, 16, 12, mainColor);
  drawPixelRect(ctx, px + 6, py + 6, 12, 8, COLORS.darkBlue);
  
  drawPixelRect(ctx, px, py + 12, 8, 16, mainColor);
  drawPixelRect(ctx, px + 4, py + 14, 4, 12, accentColor);
  
  drawPixelRect(ctx, px + 20, py + 12, 8, 16, mainColor);
  drawPixelRect(ctx, px + 24, py + 14, 4, 12, accentColor);
  
  drawPixelRect(ctx, px + 6, py + 20, 16, 16, mainColor);
  drawPixelRect(ctx, px + 8, py + 22, 12, 12, COLORS.darkBlue);
  
  const legOffset = frame < 2 ? 2 : -2;
  const legY = mech.animationType === 'walk' ? legOffset : 0;
  
  drawPixelRect(ctx, px + 8, py + 36 + legY, 6, 12, mainColor);
  drawPixelRect(ctx, px + 10, py + 44 + legY, 2, 4, accentColor);
  
  drawPixelRect(ctx, px + 14, py + 36 - legY, 6, 12, mainColor);
  drawPixelRect(ctx, px + 16, py + 44 - legY, 2, 4, accentColor);
  
  if (mech.animationType === 'attack') {
    const armExtend = frame < 2 ? 8 : 0;
    if (mech.direction === 'right') {
      drawPixelRect(ctx, px + 28 + armExtend, py + 16, 8, 4, mainColor);
      drawPixelRect(ctx, px + 36 + armExtend, py + 14, 6, 8, accentColor);
    } else {
      drawPixelRect(ctx, px - 8 - armExtend, py + 16, 8, 4, mainColor);
      drawPixelRect(ctx, px - 14 - armExtend, py + 14, 6, 8, accentColor);
    }
  } else if (mech.animationType === 'defend') {
    if (mech.direction === 'right') {
      drawPixelRect(ctx, px + 20, py + 8, 12, 8, accentColor);
    } else {
      drawPixelRect(ctx, px - 4, py + 8, 12, 8, accentColor);
    }
  }
  
  if (mech.animationType === 'hit') {
    ctx.fillStyle = COLORS.red;
    ctx.globalAlpha = 0.5 + (frame % 2) * 0.5;
    ctx.fillRect(px, py, 24, 48);
    ctx.globalAlpha = 1;
  }
  
  if (mech.isDefending) {
    ctx.strokeStyle = COLORS.yellow;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 200) * 0.3;
    ctx.strokeRect(px - 2, py - 2, 28, 52);
    ctx.globalAlpha = 1;
  }
};

export const drawHealthBar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  health: number,
  maxHealth: number,
  isPlayer1: boolean
): void => {
  const barWidth = 120;
  const barHeight = 12;
  
  const bgColor = COLORS.gray;
  const healthColor = health > maxHealth * 0.3 ? COLORS.green : COLORS.red;
  
  drawPixelRect(ctx, x, y, barWidth, barHeight, bgColor);
  
  const healthWidth = (health / maxHealth) * barWidth;
  drawPixelRect(ctx, x, y, healthWidth, barHeight, healthColor);
  
  ctx.strokeStyle = isPlayer1 ? COLORS.cyan : COLORS.magenta;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, barWidth, barHeight);
  
  ctx.fillStyle = COLORS.yellow;
  ctx.font = '8px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillText(`${health}/${maxHealth}`, x + barWidth / 2, y + 10);
};
