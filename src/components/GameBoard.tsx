
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
    }
  };

  const handleTouchEnd = () => {
    if (isDrawing) {
      onEndDrawing();
    }
  };

  return (
    <div
      ref={boardRef}
      className="relative bg-white/90 rounded-3xl p-4 shadow-2xl backdrop-blur-sm"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      <svg
        className="absolute inset-0 pointer-events-none z-20"
        style={{ padding: '1rem' }}
      >
        {svgPath && (
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

      <div className="grid grid-cols-6 gap-2 aspect-square">
        {grid.map((row, rowIndex) =>
          row.map((fruit, colIndex) => (
            <div key={fruit?.id || `${rowIndex}-${colIndex}`} className="relative">
              <div className={`
                absolute inset-1 rounded-2xl
                ${fruit && isSelected(fruit) ? 'bg-gradient-to-br from-orange-200 to-yellow-200 shadow-inner' : 'bg-gradient-to-br from-gray-100 to-gray-200'}
                transition-all duration-200
              `} />
              <FruitCell
                fruit={fruit}
                isSelected={fruit ? isSelected(fruit) : false}
                onMouseDown={() => fruit && onStartDrawing(fruit)}
                onMouseEnter={() => fruit && onSelectFruit(fruit)}
                onTouchStart={() => fruit && onStartDrawing(fruit)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
