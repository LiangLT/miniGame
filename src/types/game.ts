export interface Mech {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  isDefending: boolean;
  animationFrame: number;
  animationType: 'idle' | 'walk' | 'attack' | 'defend' | 'hit';
  direction: 'left' | 'right';
}

export interface GameState {
  mech1: Mech;
  mech2: Mech;
  currentTurn: 'player1' | 'player2';
  gamePhase: 'playing' | 'victory';
  winner: 'player1' | 'player2' | null;
  actionLog: string[];
  isAnimating: boolean;
}

export type ActionType = 'move' | 'attack' | 'defend';

export interface Position {
  x: number;
  y: number;
}
