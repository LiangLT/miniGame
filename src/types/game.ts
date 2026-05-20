
export type FruitType = '🍎' | '🍊' | '🍋' | '🍇' | '🍓' | '🍑' | '🍒' | '🥝';

export interface Fruit {
  id: string;
  type: FruitType;
  row: number;
  col: number;
  isMatched?: boolean;
  isFalling?: boolean;
}

export interface Level {
  level: number;
  targetScore: number;
  timeLimit: number;
  fruitTypes: number;
}

export interface GameState {
  grid: (Fruit | null)[][];
  score: number;
  highScore: number;
  isDrawing: boolean;
  selectedFruits: Fruit[];
  gameOver: boolean;
  combo: number;
  level: number;
  targetScore: number;
  timeRemaining: number;
  levelComplete: boolean;
}
