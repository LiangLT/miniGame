
import React, { useRef, useState, useEffect } from 'react';
import { Fruit } from '../types/game';
import { FruitCell } from './FruitCell';

interface GameBoardProps {
  grid: (Fruit | null)[][];
  selectedFruits: Fruit[];
  isDrawing: boolean;
  onSelectFruit: (fruit: Fruit) => void;
  onStartDrawing: (fruit: Fruit) => void;
  onEndDrawing: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  selectedFruits,
  isDrawing,
  onSelectFruit,
  onStartDrawing,
  onEndDrawing,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [svgPath, setSvgPath] = useState<string>('');
  const [touchPath, setTouchPath] = useState<string>('');
  const [lastTouchedCell, setLastTouchedCell] = useState<string | null>(null);

  const getCellCenter = (row: number, col: number) => {
    if (!boardRef.current) return { x: 0, y: 0 };
    const cellSize = boardRef.current.clientWidth / 6;
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    };
  };

  useEffect(() => {
    if (selectedFruits.length > 0) {
      const points = selectedFruits.map(fruit => getCellCenter(fruit.row, fruit.col));
      const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      setSvgPath(path);
    } else {
      setSvgPath('');
    }
  }, [selectedFruits]);

  const isSelected = (fruit: Fruit) => {
    return selectedFruits.some(f => f.id === fruit.id);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      onEndDrawing();
      setLastTouchedCell(null);
    }
  };

  const handleTouchEnd = () => {
    if (isDrawing) {
      onEndDrawing();
      setTouchPath('');
      setLastTouchedCell(null);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing || !boardRef.current) return;
    
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = boardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const cellSize = rect.width / 6;
    
    const centerX = x + rect.left - rect.width / 2;
    const centerY = y + rect.top - rect.height / 2;
    
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    const cellKey = `${row}-${col}`;
    
    if (row >= 0 && row < 6 && col >= 0 && col < 6 && lastTouchedCell !== cellKey) {
      const fruit = grid[row][col];
      if (fruit) {
        const lastSelected = selectedFruits[selectedFruits.length - 1];
        
        if (lastSelected) {
          const rowDiff = Math.abs(lastSelected.row - row);
          const colDiff = Math.abs(lastSelected.col - col);
          
          if ((rowDiff <= 1 && colDiff <= 1) && lastSelected.type === fruit.type) {
            const alreadySelected = selectedFruits.some(f => f.id === fruit.id);
            if (!alreadySelected) {
              onSelectFruit(fruit);
              setLastTouchedCell(cellKey);
            }
          }
        } else {
          onSelectFruit(fruit);
          setLastTouchedCell(cellKey);
        }
      }
    }
    
    const points = selectedFruits.map(fruit => getCellCenter(fruit.row, fruit.col));
    if (points.length > 0) {
      const currentPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      const extendedPath = `${currentPath} L ${x} ${y}`;
      setTouchPath(extendedPath);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={boardRef}
      className="relative bg-white/95 rounded-3xl p-2 md:p-4 shadow-2xl backdrop-blur-sm touch-none select-none"
      style={{ touchAction: 'none' }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
    >
      <svg
        className="absolute inset-0 pointer-events-none z-20"
        style={{ padding: '0.5rem' }}
      >
        {touchPath && (
          <path
            d={touchPath}
            fill="none"
            stroke="#FF9800"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        )}
        {svgPath && !touchPath && (
          <path
            d={svgPath}
            fill="none"
            stroke="#FF9800"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
        )}
      </svg>

      <div className="grid grid-cols-6 gap-1 md:gap-2 aspect-square">
        {grid.map((row, rowIndex) =>
          row.map((fruit, colIndex) => (
            <div
              key={fruit?.id || `${rowIndex}-${colIndex}`}
              className="relative aspect-square cursor-pointer touch-manipulation"
            >
              <div className={`
                absolute inset-0.5 md:inset-1 rounded-xl md:rounded-2xl
                ${fruit && isSelected(fruit) ? 'bg-gradient-to-br from-orange-200 to-yellow-200 shadow-inner' : 'bg-gradient-to-br from-gray-50 to-gray-100'}
                transition-all duration-100
              `} />
              <FruitCell
                fruit={fruit}
                isSelected={fruit ? isSelected(fruit) : false}
                onMouseDown={() => fruit && onStartDrawing(fruit)}
                onMouseEnter={() => fruit && isDrawing && fruit && onSelectFruit(fruit)}
                onTouchStart={() => fruit && onStartDrawing(fruit)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

