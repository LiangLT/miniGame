import { Tile, GRID_SIZE, LAYER_COUNT } from '../types/sheepGame';

interface TileBoardProps {
  tiles: Tile[][];
  removingTiles: string[];
  onTileClick: (tile: Tile) => void;
}

export function TileBoard({ tiles, removingTiles, onTileClick }: TileBoardProps) {
  const getTileStyle = (tile: Tile) => {
    const baseSize = 48;
    const layerOffset = 4;
    const horizontalOffset = tile.layer * layerOffset;
    const verticalOffset = tile.layer * layerOffset;
    
    const centerX = (GRID_SIZE - 1) / 2;
    const offsetX = (tile.col - centerX) * baseSize;
    const offsetY = (tile.row - centerX) * baseSize;
    
    const x = offsetX + horizontalOffset;
    const y = offsetY + verticalOffset;
    
    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
      zIndex: tile.layer * 10 + tile.row,
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
    <div className="relative w-full max-w-xs mx-auto aspect-square">
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)',
        }}
      >
        {visibleTiles.map(tile => {
          const isRemoving = removingTiles.includes(tile.id);
          const style = getTileStyle(tile);
          
          return (
            <button
              key={tile.id}
              onClick={() => !tile.isCovered && !tile.isRemoved && onTileClick(tile)}
              disabled={tile.isCovered || tile.isRemoved}
              className={`
                absolute -translate-x-1/2 -translate-y-1/2
                w-10 h-10 md:w-12 md:h-12
                flex items-center justify-center text-2xl md:text-3xl
                rounded-lg
                transition-all duration-200
                shadow-md
                select-none
                ${tile.isCovered 
                  ? 'opacity-40 cursor-not-allowed grayscale' 
                  : 'cursor-pointer hover:scale-110 hover:shadow-lg hover:z-50'
                }
                ${isRemoving ? 'animate-ping opacity-0' : ''}
              `}
              style={{
                ...style,
                backgroundColor: tile.isCovered ? '#9ca3af' : '#fff',
                border: `2px solid ${tile.isCovered ? '#6b7280' : '#e5e7eb'}`,
              }}
            >
              {tile.type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
