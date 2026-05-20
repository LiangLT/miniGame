import { useState, useCallback, useEffect, useRef } from 'react';
import { Fruit, FruitType, GameState } from '../types/game';

const ALL_FRUIT_TYPES: FruitType[] = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍒', '🥝'];
const GRID_SIZE = 6;

const getLevelConfig = (level: number) => {
  const baseTarget = 100;
  const targetIncrease = level * 50;
  const targetScore = baseTarget + targetIncrease;
  
  const baseTime = 60;
  const timeDecrease = Math.min(level * 3, 30);
  const timeLimit = Math.max(baseTime - timeDecrease, 30);
  
  const fruitTypes = Math.min(3 + Math.floor(level / 2), 8);
  
  return {
    level,
    targetScore,
    timeLimit,
    fruitTypes,
  };
};

const generateRandomFruit = (row: number, col: number, availableTypes: FruitType[]): Fruit => ({
  id: `${row}-${col}-${Date.now()}-${Math.random()}`,
  type: availableTypes[Math.floor(Math.random() * availableTypes.length)],
  row,
  col,
});

const initializeGrid = (availableTypes: FruitType[]): (Fruit | null)[][] => {
  const grid: (Fruit | null)[][] = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = generateRandomFruit(row, col, availableTypes);
    }
  }
  return grid;
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    grid: [],
    score: 0,
    highScore: parseInt(localStorage.getItem('fruitSliceHighScore') || '0'),
    isDrawing: false,
    selectedFruits: [],
    gameOver: false,
    combo: 0,
    level: 1,
    targetScore: 100,
    timeRemaining: 60,
    levelComplete: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  const initializeLevel = useCallback((level: number) => {
    const config = getLevelConfig(level);
    const availableTypes = ALL_FRUIT_TYPES.slice(0, config.fruitTypes);
    
    setGameState(prev => ({
      ...prev,
      grid: initializeGrid(availableTypes),
      score: prev.score,
      isDrawing: false,
      selectedFruits: [],
      gameOver: false,
      combo: 0,
      level: config.level,
      targetScore: config.targetScore,
      timeRemaining: config.timeLimit,
      levelComplete: false,
    }));
  }, []);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      initializeLevel(1);
    }
  }, [initializeLevel]);

  useEffect(() => {
    if (!gameState.gameOver && !gameState.levelComplete && gameState.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining <= 1) {
            clearInterval(timerRef.current!);
            return { ...prev, timeRemaining: 0, gameOver: true };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.gameOver, gameState.levelComplete, gameState.timeRemaining]);

  useEffect(() => {
    if (gameState.score >= gameState.targetScore && !gameState.levelComplete) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setGameState(prev => ({ ...prev, levelComplete: true }));
    }
  }, [gameState.score, gameState.targetScore, gameState.levelComplete]);

  const isAdjacent = (fruit1: Fruit, fruit2: Fruit): boolean => {
    const rowDiff = Math.abs(fruit1.row - fruit2.row);
    const colDiff = Math.abs(fruit1.col - fruit2.col);
    return (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
  };

  const selectFruit = useCallback((fruit: Fruit) => {
    setGameState(prev => {
      if (!prev.isDrawing || prev.gameOver || prev.levelComplete) return prev;

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
    setGameState(prev => {
      if (prev.gameOver || prev.levelComplete) return prev;
      return {
        ...prev,
        isDrawing: true,
        selectedFruits: [fruit],
      };
    });
  }, []);

  const endDrawing = useCallback(() => {
    setGameState(prev => {
      if (prev.gameOver || prev.levelComplete) {
        return { ...prev, isDrawing: false, selectedFruits: [] };
      }

      if (prev.selectedFruits.length >= 3) {
        const newGrid = prev.grid.map(row => [...row]);
        const matchedIds = new Set(prev.selectedFruits.map(f => f.id));

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

        setTimeout(() => {
          setGameState(p => {
            const clearedGrid = p.grid.map(row => [...row]);
            const config = getLevelConfig(p.level);
            const availableTypes = ALL_FRUIT_TYPES.slice(0, config.fruitTypes);

            for (let row = 0; row < GRID_SIZE; row++) {
              for (let col = 0; col < GRID_SIZE; col++) {
                if (clearedGrid[row][col]?.isMatched) {
                  clearedGrid[row][col] = null;
                }
              }
            }

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

              for (let row = emptyRow; row >= 0; row--) {
                clearedGrid[row][col] = generateRandomFruit(row, col, availableTypes);
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

  const nextLevel = useCallback(() => {
    const nextLevelNum = gameState.level + 1;
    initializeLevel(nextLevelNum);
  }, [gameState.level, initializeLevel]);

  const restartGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState(prev => ({
      ...prev,
      score: 0,
      isDrawing: false,
      selectedFruits: [],
      gameOver: false,
      combo: 0,
      levelComplete: false,
    }));
    initializeLevel(1);
  }, [initializeLevel]);

  const restartLevel = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    initializeLevel(gameState.level);
  }, [gameState.level, initializeLevel]);

  return {
    gameState,
    selectFruit,
    startDrawing,
    endDrawing,
    restartGame,
    nextLevel,
    restartLevel,
  };
};
