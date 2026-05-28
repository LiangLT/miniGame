import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Tile,
  TileType,
  SheepGameState,
  GameSnapshot,
  SLOT_COUNT,
  LAYER_COUNT,
  GRID_SIZE,
  TILE_TYPES,
} from '../types/sheepGame';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const initializeTiles = (level: number): Tile[][] => {
  const tilesPerLayer = GRID_SIZE * GRID_SIZE;
  const totalTiles = tilesPerLayer * LAYER_COUNT;
  const tileTypesCount = Math.min(4 + Math.floor(level / 2), TILE_TYPES.length);
  const availableTypes = TILE_TYPES.slice(0, tileTypesCount);
  
  const allTiles: TileType[] = [];
  while (allTiles.length < totalTiles) {
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    allTiles.push(type);
    allTiles.push(type);
    allTiles.push(type);
  }
  
  const shuffled = allTiles.sort(() => Math.random() - 0.5).slice(0, totalTiles);
  
  const layers: Tile[][] = [];
  let tileIndex = 0;
  
  for (let layer = 0; layer < LAYER_COUNT; layer++) {
    const layerTiles: Tile[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        layerTiles.push({
          id: generateId(),
          type: shuffled[tileIndex++],
          layer,
          row,
          col,
          isCovered: false,
          isRemoved: false,
          isFlipped: false,
        });
      }
    }
    layers.push(layerTiles);
  }
  
  return layers;
};

const updateCoveredStatus = (layers: Tile[][]): Tile[][] => {
  const coveredPositions = new Set<string>();
  
  for (let layer = LAYER_COUNT - 1; layer >= 0; layer--) {
    const currentLayer = layers[layer];
    const newLayer: Tile[] = [];
    
    for (const tile of currentLayer) {
      if (tile.isRemoved) {
        newLayer.push({ ...tile, isCovered: false });
        continue;
      }
      
      let isCovered = false;
      if (layer < LAYER_COUNT - 1) {
        const posKey = `${tile.row}-${tile.col}`;
        if (coveredPositions.has(posKey)) {
          isCovered = true;
        }
      }
      
      coveredPositions.add(`${tile.row}-${tile.col}`);
      newLayer.push({ ...tile, isCovered });
    }
    
    layers[layer] = newLayer;
  }
  
  return layers;
};

const getSnapshot = (state: SheepGameState): GameSnapshot => ({
  tiles: state.tiles.map(layer => layer.map(tile => ({ ...tile }))),
  slots: [...state.slots],
  removedTiles: state.removedTiles.map(tile => ({ ...tile })),
  score: state.score,
});

const getInitialState = (level: number): SheepGameState => {
  let layers = initializeTiles(level);
  layers = updateCoveredStatus(layers);
  
  return {
    tiles: layers,
    slots: Array(SLOT_COUNT).fill(null),
    removedTiles: [],
    score: 0,
    level,
    gameOver: false,
    victory: false,
    props: {
      remove: 1,
      undo: 3,
      shuffle: 1,
    },
    history: [],
    matchedTiles: [],
  };
};

export const useSheepGame = () => {
  const [gameState, setGameState] = useState<SheepGameState>(() => getInitialState(1));
  const [removingTiles, setRemovingTiles] = useState<string[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      setGameState(getInitialState(1));
    }
  }, []);

  const checkMatches = useCallback((slots: (Tile | null)[]): { newSlots: (Tile | null)[]; matched: Tile[]; scoreGain: number } => {
    const typeCount: Record<string, Tile[]> = {};
    
    slots.forEach((tile, index) => {
      if (tile) {
        const key = tile.type;
        if (!typeCount[key]) {
          typeCount[key] = [];
        }
        typeCount[key].push(tile);
      }
    });
    
    const matched: Tile[] = [];
    const matchedIds = new Set<string>();
    
    Object.values(typeCount).forEach(tiles => {
      if (tiles.length >= 3) {
        tiles.slice(0, 3).forEach(tile => {
          matched.push(tile);
          matchedIds.add(tile.id);
        });
      }
    });
    
    if (matched.length > 0) {
      const newSlots = slots.map(tile => 
        tile && matchedIds.has(tile.id) ? null : tile
      );
      return { newSlots, matched, scoreGain: matched.length * 10 };
    }
    
    return { newSlots: slots, matched: [], scoreGain: 0 };
  }, []);

  const checkGameOver = useCallback((slots: (Tile | null)[], layers: Tile[][]): boolean => {
    const filledSlots = slots.filter(s => s !== null).length;
    if (filledSlots < SLOT_COUNT) return false;
    
    const typeCount: Record<string, number> = {};
    slots.forEach(tile => {
      if (tile) {
        typeCount[tile.type] = (typeCount[tile.type] || 0) + 1;
      }
    });
    
    return !Object.values(typeCount).some(count => count >= 3);
  }, []);

  const checkVictory = useCallback((layers: Tile[][]): boolean => {
    for (const layer of layers) {
      const remaining = layer.filter(t => !t.isRemoved);
      if (remaining.length > 0) return false;
    }
    return true;
  }, []);

  const clickTile = useCallback((tile: Tile) => {
    if (gameState.gameOver || gameState.victory) return;
    if (tile.isCovered || tile.isRemoved) return;
    
    // 如果牌没有翻开，先翻牌
    if (!tile.isFlipped) {
      setGameState(prev => {
        const newLayers = prev.tiles.map(layer => 
          layer.map(t => t.id === tile.id ? { ...t, isFlipped: true } : t)
        );
        return {
          ...prev,
          tiles: newLayers,
        };
      });
      return;
    }
    
    // 牌已翻开，放入槽位
    const emptySlotIndex = gameState.slots.findIndex(s => s === null);
    if (emptySlotIndex === -1) return;
    
    setGameState(prev => {
      const snapshot = getSnapshot(prev);
      
      const newLayers = prev.tiles.map(layer => 
        layer.map(t => t.id === tile.id ? { ...t, isRemoved: true } : t)
      );
      
      const updatedLayers = updateCoveredStatus(newLayers);
      
      const newSlots = [...prev.slots];
      const clickedTile = { ...tile, isRemoved: true, isCovered: false };
      newSlots[emptySlotIndex] = clickedTile;
      
      const matchResult = checkMatches(newSlots);
      let finalSlots = matchResult.newSlots;
      let scoreGain = matchResult.scoreGain;
      
      if (matchResult.matched.length > 0) {
        setRemovingTiles(matchResult.matched.map(t => t.id));
        
        setTimeout(() => {
          setGameState(p => {
            const restoredLayers = p.tiles.map(layer =>
              layer.map(t => matchResult.matched.some(m => m.id === t.id) ? { ...t, isRemoved: true } : t)
            );
            return {
              ...p,
              tiles: restoredLayers,
              matchedTiles: [],
            };
          });
          setRemovingTiles([]);
        }, 300);
      }
      
      const newHistory = [...prev.history, snapshot].slice(-20);
      
      if (matchResult.matched.length > 0) {
        const gameOver = checkGameOver(matchResult.newSlots, updatedLayers);
        const victory = checkVictory(updatedLayers);
        
        return {
          ...prev,
          tiles: updatedLayers,
          slots: finalSlots,
          score: prev.score + scoreGain,
          gameOver,
          victory,
          history: newHistory,
          matchedTiles: matchResult.matched.map(t => t.id),
        };
      }
      
      const gameOver = checkGameOver(finalSlots, updatedLayers);
      
      return {
        ...prev,
        tiles: updatedLayers,
        slots: finalSlots,
        score: prev.score + scoreGain,
        gameOver,
        victory: false,
        history: newHistory,
        matchedTiles: [],
      };
    });
  }, [gameState.gameOver, gameState.victory, gameState.slots, checkMatches, checkGameOver, checkVictory]);

  const clickSlotTile = useCallback((slotIndex: number) => {
    if (gameState.gameOver || gameState.victory) return;
    if (!gameState.removedTiles.some(t => !t.isRemoved)) return;
    
    const emptySlotIndex = gameState.slots.findIndex(s => s === null);
    if (emptySlotIndex === -1) return;
    
    setGameState(prev => {
      const removedTile = prev.removedTiles.find(t => !t.isRemoved);
      if (!removedTile) return prev;
      
      const newRemovedTiles = prev.removedTiles.map(t => 
        t.id === removedTile.id ? { ...t, isRemoved: true } : t
      );
      
      const newSlots = [...prev.slots];
      newSlots[emptySlotIndex] = { ...removedTile, isRemoved: false };
      
      const matchResult = checkMatches(newSlots);
      let finalSlots = matchResult.newSlots;
      let scoreGain = matchResult.scoreGain;
      
      if (matchResult.matched.length > 0) {
        setRemovingTiles(matchResult.matched.map(t => t.id));
        
        setTimeout(() => {
          setGameState(p => {
            const restoredLayers = p.tiles.map(layer =>
              layer.map(t => matchResult.matched.some(m => m.id === t.id) ? { ...t, isRemoved: true } : t)
            );
            return {
              ...p,
              tiles: restoredLayers,
              matchedTiles: [],
            };
          });
          setRemovingTiles([]);
        }, 300);
      }
      
      const newLayers = updateCoveredStatus(prev.tiles);
      const gameOver = checkGameOver(finalSlots, newLayers);
      
      return {
        ...prev,
        removedTiles: newRemovedTiles,
        slots: finalSlots,
        score: prev.score + scoreGain,
        gameOver,
        history: [...prev.history, getSnapshot({ ...prev, removedTiles: newRemovedTiles })],
        matchedTiles: matchResult.matched.length > 0 ? matchResult.matched.map(t => t.id) : [],
      };
    });
  }, [gameState.gameOver, gameState.victory, gameState.removedTiles, gameState.slots, checkMatches, checkGameOver]);

  const useRemoveProp = useCallback(() => {
    if (gameState.props.remove <= 0 || gameState.gameOver || gameState.victory) return;
    
    setGameState(prev => {
      const slotsWithTiles = prev.slots
        .map((tile, idx) => ({ tile, idx }))
        .filter(s => s.tile !== null)
        .slice(0, 3);
      
      if (slotsWithTiles.length === 0) return prev;
      
      const snapshot = getSnapshot(prev);
      
      const newRemovedTiles = [
        ...prev.removedTiles,
        ...slotsWithTiles.map(s => ({ ...s.tile!, isRemoved: false }))
      ];
      
      const newSlots = [...prev.slots];
      slotsWithTiles.forEach(s => {
        newSlots[s.idx] = null;
      });
      
      return {
        ...prev,
        removedTiles: newRemovedTiles,
        slots: newSlots,
        props: { ...prev.props, remove: prev.props.remove - 1 },
        history: [...prev.history, snapshot],
      };
    });
  }, [gameState.props.remove, gameState.gameOver, gameState.victory]);

  const useUndoProp = useCallback(() => {
    if (gameState.props.undo <= 0 || gameState.gameOver || gameState.victory) return;
    if (gameState.history.length === 0) return;
    
    setGameState(prev => {
      const lastSnapshot = prev.history[prev.history.length - 1];
      
      return {
        ...prev,
        tiles: updateCoveredStatus(lastSnapshot.tiles.map(layer => layer.map(tile => ({ ...tile, isRemoved: false })))),
        slots: [...lastSnapshot.slots],
        removedTiles: [...lastSnapshot.removedTiles],
        score: lastSnapshot.score,
        props: { ...prev.props, undo: prev.props.undo - 1 },
        history: prev.history.slice(0, -1),
        matchedTiles: [],
      };
    });
  }, [gameState.props.undo, gameState.gameOver, gameState.victory, gameState.history]);

  const useShuffleProp = useCallback(() => {
    if (gameState.props.shuffle <= 0 || gameState.gameOver || gameState.victory) return;
    
    setGameState(prev => {
      const snapshot = getSnapshot(prev);
      
      const allTiles: Tile[] = [];
      for (const layer of prev.tiles) {
        for (const tile of layer) {
          if (!tile.isRemoved) {
            allTiles.push(tile);
          }
        }
      }
      
      const shuffledTypes = allTiles.map(t => t.type).sort(() => Math.random() - 0.5);
      
      const reshuffledTiles = allTiles.map((tile, idx) => ({
        ...tile,
        type: shuffledTypes[idx],
      }));
      
      const newLayers: Tile[][] = Array(LAYER_COUNT).fill(null).map(() => []);
      
      for (let layer = 0; layer < LAYER_COUNT; layer++) {
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            const tileIndex = layer * GRID_SIZE * GRID_SIZE + row * GRID_SIZE + col;
            const originalTile = prev.tiles[layer]?.find(t => t.row === row && t.col === col);
            if (originalTile) {
              const newTile = reshuffledTiles.find(t => t.id === originalTile.id);
              if (newTile) {
                newLayers[layer].push(newTile);
              }
            }
          }
        }
      }
      
      const finalLayers = updateCoveredStatus(newLayers);
      
      return {
        ...prev,
        tiles: finalLayers,
        props: { ...prev.props, shuffle: prev.props.shuffle - 1 },
        history: [...prev.history, snapshot],
      };
    });
  }, [gameState.props.shuffle, gameState.gameOver, gameState.victory]);

  const restartGame = useCallback((level: number = 1) => {
    setRemovingTiles([]);
    setGameState(getInitialState(level));
  }, []);

  const nextLevel = useCallback(() => {
    restartGame(gameState.level + 1);
  }, [gameState.level, restartGame]);

  return {
    gameState,
    removingTiles,
    clickTile,
    clickSlotTile,
    useRemoveProp,
    useUndoProp,
    useShuffleProp,
    restartGame,
    nextLevel,
  };
};
