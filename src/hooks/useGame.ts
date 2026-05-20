
import { useState, useEffect, useCallback } from 'react';
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
        prev.selectedFruits.forEach(fruit => {
          if (newGrid[fruit.row][fruit.col]) {
            newGrid[fruit.row][fruit.col]!.isMatched = true;
          }
        });

        const points = prev.selectedFruits.length * 10 * (1 + prev.combo * 0.5);
        const newScore = prev.score + Math.floor(points);
        const newCombo = prev.combo + 1;
        const newHighScore = Math.max(newScore, prev.highScore);

        localStorage.setItem('fruitSliceHighScore', newHighScore.toString());

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState(prev => {
        if (prev.selectedFruits.length > 0 || prev.gameOver) return prev;

        const newGrid = prev.grid.map(row => [...row]);
        let hasMatches = false;

        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            if (newGrid[row][col]?.isMatched) {
              newGrid[row][col] = null;
              hasMatches = true;
            }
          }
        }

        if (!hasMatches) return prev;

        for (let col = 0; col < GRID_SIZE; col++) {
          let emptyRow = GRID_SIZE - 1;
          for (let row = GRID_SIZE - 1; row >= 0; row--) {
            if (newGrid[row][col] !== null) {
              if (row !== emptyRow) {
                newGrid[emptyRow][col] = newGrid[row][col];
                newGrid[emptyRow][col]!.row = emptyRow;
                newGrid[row][col] = null;
              }
              emptyRow--;
            }
          }

          for (let row = emptyRow; row >= 0; row--) {
            newGrid[row][col] = generateRandomFruit(row, col);
            newGrid[row][col]!.isFalling = true;
          }
        }

        return { ...prev, grid: newGrid };
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [gameState.selectedFruits, gameState.gameOver]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState(prev => {
        const newGrid = prev.grid.map(row =>
          row.map(cell => cell ? { ...cell, isFalling: false } : null)
        );
        return { ...prev, grid: newGrid };
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [gameState.grid]);

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
