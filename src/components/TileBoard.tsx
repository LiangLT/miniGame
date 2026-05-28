import { Tile, GRID_SIZE, LAYER_COUNT } from '../types/sheepGame';

interface TileBoardProps {
  tiles: Tile[][];
  removingTiles: string[];
  onTileClick: (tile: Tile) => void;
}

export function TileBoard({ tiles, removingTiles, onTileClick }: TileBoardProps) {
  const getTileStyle = (tile: Tile) => {
    const layerOffset = 3;
    
    return {
      left: `calc(50% + ${tile.col * 2}px)`,
      top: `calc(50% + ${tile.row * 2}px)`,
      zIndex: tile.layer * 100 + tile.row * 10 + tile.col,
      transform: `translate(-50%, -50%) translate(${tile.layer * layerOffset}px, ${tile.layer * layerOffset}px)`,
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
