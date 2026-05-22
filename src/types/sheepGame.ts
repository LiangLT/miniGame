export type TileType = '🌻' | '🍄' | '🥕' | '🌿' | '🌸' | '🍀' | '🌵' | '🎃';

export const TILE_TYPES: TileType[] = ['🌻', '🍄', '🥕', '🌿', '🌸', '🍀', '🌵', '🎃'];

export interface Tile {
  id: string;
  type: TileType;
  layer: number;
  row: number;
  col: number;
  isCovered: boolean;
  isRemoved: boolean;
}

export interface Slot {
  id: number;
  tile: Tile | null;
}

export interface GameSnapshot {
  tiles: Tile[][];
  slots: (Tile | null)[];
  removedTiles: Tile[];
  score: number;
}

export interface SheepGameState {
  tiles: Tile[][];
  slots: (Tile | null)[];
  removedTiles: Tile[];
  score: number;
  level: number;
  gameOver: boolean;
  victory: boolean;
  props: {
    remove: number;
    undo: number;
    shuffle: number;
  };
  history: GameSnapshot[];
  matchedTiles: string[];
}

export const SLOT_COUNT = 7;
export const LAYER_COUNT = 3;
export const GRID_SIZE = 5;
