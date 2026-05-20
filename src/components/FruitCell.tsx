
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
        w-full h-full flex items-center justify-center
        cursor-pointer select-none touch-none
        transition-all duration-100 ease-out
        ${isSelected ? 'scale-110 z-10' : 'hover:scale-105 active:scale-95'}
        ${fruit.isMatched ? 'opacity-0 scale-0' : ''}
      `}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
    >
      <span
        className={`
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl
          ${isSelected ? 'drop-shadow-lg animate-bounce' : ''}
          select-none
        `}
        style={{
          filter: isSelected ? 'drop-shadow(0 4px 8px rgba(255, 152, 0, 0.6))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
        }}
      >
        {fruit.type}
      </span>
    </div>
  );
};

