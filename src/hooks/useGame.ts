
import { useState, useCallback } from 'react';
import { Fruit, FruitType, GameState } from '../types/game';

const FRUIT_TYPES: FruitType[] = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝'];
const GRID_SIZE = 6;

const generateRandomFruit = (row: number, col: number): Fruit => ({
  id: `${row}-${col}-${Date.now()}-${Math.random()}`,
  type: FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)],
  row,
  col,
});

const initializeGrid = (): (Fruit | null)[][] => {
  const grid: (Fruit | null)[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = generateRandomFruit(row, col);
    }
  }
  return grid;
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    grid: initializeGrid(),
    score: 0,
    highScore: parseInt(localStorage.getItem('fruitSliceHighScore') || '0'),
    isDrawing: false,
    selectedFruits: [],
    gameOver: false,
    combo: 0,
  });

  const isAdjacent = (fruit1: Fruit, fruit2: Fruit): boolean => {
    const rowDiff = Math.abs(fruit1.row - fruit2.row);
    const colDiff = Math.abs(fruit1.col - fruit2.col);
    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  };

  const selectFruit = useCallback((fruit: Fruit) => {
    setGameState(prev => {
      if (!prev.isDrawing) return prev;

      const lastSelected = prev.selectedFruits[prev.selectedFruits.length - 1];

      if (prev.selectedFruits.some(f => f.id === fruit.id)) {
        const index = prev.selectedFruits.findIndex(f => f.id === fruit.id);
        if (index === prev.selectedFruits.length - 2) {
          return { ...prev, selectedFruits: prev.selectedFruits.slice(0, -1) };
        }
        return prev;
      }

      if (lastSelected) {
        if (!isAdjacent(lastSelected, fruit) || lastSelected.type !== fruit.type) {
          return prev;
        }
      }

      return { ...prev, selectedFruits: [...prev.selectedFruits, fruit] };
    });
  }, []);

  const startDrawing = useCallback((fruit: Fruit) => {
    setGameState(prev => ({
      ...prev,
      isDrawing: true,
      selectedFruits: [fruit],
    }));
  }, []);

  const endDrawing = useCallback(() => {
    setGameState(prev => {
      if (prev.selectedFruits.length >= 3) {
        const newGrid = prev.grid.map(row => [...row]);
        const matchedIds = new Set(prev.selectedFruits.map(f => f.id));

        // Mark fruits as matched
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            if (newGrid[row][col] && matchedIds.has(newGrid[row][col]!.id)) {
              newGrid[row][col]!.isMatched = true;
            }
          }
        }

        const points = prev.selectedFruits.length * 10 * (1 + prev.combo * 0.5);
        const newScore = prev.score + Math.floor(points);
        const newCombo = prev.combo + 1;
        const newHighScore = Math.max(newScore, prev.highScore);

        localStorage.setItem('fruitSliceHighScore', newHighScore.toString());

        // Remove matched fruits and make others fall
        setTimeout(() => {
          setGameState(p => {
            const clearedGrid = p.grid.map(row => [...row]);

            // Remove matched fruits
            for (let row = 0; row < GRID_SIZE; row++) {
              for (let col = 0; col < GRID_SIZE; col++) {
                if (clearedGrid[row][col]?.isMatched) {
                  clearedGrid[row][col] = null;
                }
              }
            }

            // Make fruits fall
            for (let col = 0; col < GRID_SIZE; col++) {
              let emptyRow = GRID_SIZE - 1;
              for (let row = GRID_SIZE - 1; row >= 0; row--) {
                if (clearedGrid[row][col] !== null) {
                  if (row !== emptyRow) {
                    clearedGrid[emptyRow][col] = clearedGrid[row][col];
                    clearedGrid[emptyRow][col]!.row = emptyRow;
                    clearedGrid[row][col] = null;
                  }
                  emptyRow--;
                }
              }

              // Add new fruits
              for (let row = emptyRow; row >= 0; row--) {
                clearedGrid[row][col] = generateRandomFruit(row, col);
              }
            }

            return { ...p, grid: clearedGrid };
          });
        }, 300);

        return {
          ...prev,
          isDrawing: false,
          selectedFruits: [],
          grid: newGrid,
          score: newScore,
          highScore: newHighScore,
          combo: newCombo,
        };
      }

      return {
        ...prev,
        isDrawing: false,
        selectedFruits: [],
        combo: 0,
      };
    });
  }, []);

  const restartGame = useCallback(() => {
    setGameState({
      grid: initializeGrid(),
      score: 0,
      highScore: gameState.highScore,
      isDrawing: false,
      selectedFruits: [],
      gameOver: false,
      combo: 0,
    });
  }, [gameState.highScore]);

  return {
    gameState,
    selectFruit,
    startDrawing,
    endDrawing,
    restartGame,
  };
};

