import { useSheepGame } from '../hooks/useSheepGame';
import { TileBoard } from '../components/TileBoard';
import { SlotBar } from '../components/SlotBar';
import { PropsPanel } from '../components/PropsPanel';
import { SheepGameOver } from '../components/SheepGameOver';

export default function Home() {
  const {
    gameState,
    removingTiles,
    clickTile,
    clickSlotTile,
    useRemoveProp,
    useUndoProp,
    useShuffleProp,
    restartGame,
    nextLevel,
  } = useSheepGame();

  const totalTiles = gameState.tiles.reduce((sum, layer) => 
    sum + layer.filter(t => !t.isRemoved).length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-800 flex flex-col items-center justify-center p-2 md:p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-4 md:left-20 text-4xl md:text-7xl opacity-10 animate-pulse">🌸</div>
        <div className="absolute top-20 right-4 md:right-20 text-3xl md:text-6xl opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}>🍀</div>
        <div className="absolute bottom-20 left-4 md:left-10 text-3xl md:text-6xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>🌿</div>
        <div className="absolute bottom-10 right-4 md:right-16 text-4xl md:text-7xl opacity-10 animate-pulse" style={{ animationDelay: '1.5s' }}>🌻</div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-3 md:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-center mb-1 md:mb-2 drop-shadow-lg">
            🐑 羊了个羊 🐑
          </h1>
          <p className="text-white/70 text-xs sm:text-sm md:text-lg">
            点击方块，凑齐3个相同图案即可消除！
          </p>
        </div>

        <div className="flex justify-between items-center mb-3 md:mb-4 px-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 md:px-4 md:py-2">
            <span className="text-white/70 text-xs md:text-sm">关卡</span>
            <span className="text-white font-bold text-lg md:text-xl ml-2">{gameState.level}</span>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 md:px-4 md:py-2">
            <span className="text-white/70 text-xs md:text-sm">剩余</span>
            <span className="text-white font-bold text-lg md:text-xl ml-2">{totalTiles}</span>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 md:px-4 md:py-2">
            <span className="text-white/70 text-xs md:text-sm">得分</span>
            <span className="text-amber-300 font-bold text-lg md:text-xl ml-2">{gameState.score}</span>
          </div>
        </div>

        <TileBoard
          tiles={gameState.tiles}
          removingTiles={removingTiles}
          onTileClick={clickTile}
        />

        <div className="my-4 md:my-6">
          <SlotBar
            slots={gameState.slots}
            removingTiles={removingTiles}
          />
        </div>

        <PropsPanel
          props={gameState.props}
          removedTiles={gameState.removedTiles}
          onRemove={useRemoveProp}
          onUndo={useUndoProp}
          onShuffle={useShuffleProp}
          onRemovedTileClick={clickSlotTile}
          disabled={gameState.gameOver || gameState.victory}
        />

        <div className="mt-4 md:mt-6 text-center text-white/60 text-xs md:text-sm space-y-1">
          <p>💡 点击未被覆盖的方块即可放入槽位</p>
          <p>💡 槽位凑齐3个相同图案自动消除</p>
        </div>
      </div>

      {(gameState.gameOver || gameState.victory) && (
        <SheepGameOver
          victory={gameState.victory}
          score={gameState.score}
          level={gameState.level}
          onRestart={() => restartGame(1)}
          onNextLevel={gameState.victory ? nextLevel : undefined}
        />
      )}
    </div>
  );
}
