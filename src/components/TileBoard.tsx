import { Tile, GRID_SIZE, LAYER_COUNT } from '../types/sheepGame';

interface TileBoardProps {
  tiles: Tile[][];
  removingTiles: string[];
  onTileClick: (tile: Tile) => void;
  selectedFlippedTileId: string | null;
}

export function TileBoard({ tiles, removingTiles, onTileClick, selectedFlippedTileId }: TileBoardProps) {
  const getTileStyle = (tile: Tile) => {
    const tileSize = 36;
    const gap = 4;
    const totalSize = tileSize + gap;
    
    const x = (tile.col - (GRID_SIZE - 1) / 2) * totalSize;
    const y = (tile.row - (GRID_SIZE - 1) / 2) * totalSize;
    
    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
      zIndex: tile.layer * 1000 + tile.row * 10 + tile.col,
    };
  };

  const visibleTiles: Tile[] = [];
  
  for (let layer = LAYER_COUNT - 1; layer >= 0; layer--) {
    const layerTiles = tiles[layer] || [];
    for (const tile of layerTiles) {
      if (!tile.isRemoved) {
        visibleTiles.push(tile);
      }
    }
  }

  return (
    <div className="relative w-full h-96 md:h-[500px] mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        {visibleTiles.map(tile => {
          const isRemoving = removingTiles.includes(tile.id);
          const isSelected = selectedFlippedTileId === tile.id;
          const isDisabled = tile.isCovered || tile.isRemoved || (selectedFlippedTileId && selectedFlippedTileId !== tile.id && !tile.isFlipped);
          const style = getTileStyle(tile);
          
          return (
            <button
              key={tile.id}
              onClick={() => !isDisabled && onTileClick(tile)}
              disabled={isDisabled}
              className={`
                absolute -translate-x-1/2 -translate-y-1/2
                w-8 h-8 md:w-9 md:h-9
                flex items-center justify-center text-xl md:text-2xl
                rounded-lg
                transition-all duration-300
                shadow-md
                select-none
                ${tile.isCovered 
                  ? 'opacity-30 cursor-not-allowed grayscale' 
                  : (isDisabled && !isSelected
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:scale-105 hover:shadow-lg hover:z-[9999]'
                    )
                }
                ${isRemoving ? 'animate-ping opacity-0' : ''}
                ${tile.isFlipped ? 'flipped' : ''}
                ${isSelected ? 'ring-4 ring-yellow-400 scale-110 shadow-xl z-[9999]' : ''}
              `}
              style={{
                ...style,
                backgroundColor: tile.isCovered 
                  ? '#6b7280' 
                  : (tile.isFlipped 
                      ? (isSelected ? '#fef3c7' : '#ffffff')
                      : '#3b82f6'),
                border: `2px solid ${tile.isCovered ? '#4b5563' : (tile.isFlipped ? (isSelected ? '#f59e0b' : '#d1d5db') : '#2563eb')}`,
              }}
            >
              <span className={`tile-content ${tile.isFlipped ? 'show' : 'hide'}`}>
                {tile.isFlipped ? tile.type : ''}
              </span>
            </button>
          );
        })}
      </div>
      <style>{`
        .tile-content {
          transition: opacity 0.3s ease;
        }
        .tile-content.hide {
          opacity: 0;
        }
        .tile-content.show {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
