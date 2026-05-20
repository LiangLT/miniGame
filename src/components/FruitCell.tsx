
import React from 'react';
import { Fruit } from '../types/game';

interface FruitCellProps {
  fruit: Fruit | null;
  isSelected: boolean;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onTouchStart: () => void;
}

export const FruitCell: React.FC<FruitCellProps> = ({
  fruit,
  isSelected,
  onMouseDown,
  onMouseEnter,
  onTouchStart,
}) => {
  if (!fruit) {
    return <div className="w-full h-full" />;
  }

  return (
    <div
      className={`
        w-full h-full flex items-center justify-center text-4xl
        cursor-pointer select-none transition-all duration-200
        ${isSelected ? 'scale-110 z-10' : 'hover:scale-105'}
        ${fruit.isMatched ? 'opacity-0 scale-0' : ''}
        ${fruit.isFalling ? 'animate-fall' : ''}
      `}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
    >
      <span className={`${isSelected ? 'drop-shadow-lg' : ''}`}>{fruit.type}</span>
    </div>
  );
};
