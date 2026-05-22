import { Tile, SLOT_COUNT } from '../types/sheepGame';

interface SlotBarProps {
  slots: (Tile | null)[];
  removingTiles: string[];
}

export function SlotBar({ slots, removingTiles }: SlotBarProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center gap-1 md:gap-2 p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl">
        {Array.from({ length: SLOT_COUNT }).map((_, index) => {
          const tile = slots[index];
          const isRemoving = tile && removingTiles.includes(tile.id);
          
          return (
            <div
              key={index}
              className={`
                w-9 h-12 md:w-12 md:h-14
                flex items-center justify-center
                rounded-lg md:rounded-xl
                border-2 border-dashed
                transition-all duration-200
                ${tile 
                  ? 'bg-white border-white shadow-md' 
                  : 'bg-white/30 border-white/50'
                }
              `}
            >
              {tile && (
                <span
                  className={`
                    text-xl md:text-2xl
                    ${isRemoving ? 'animate-ping opacity-0' : ''}
                  `}
                >
                  {tile.type}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
