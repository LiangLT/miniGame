interface PropsPanelProps {
  props: {
    remove: number;
    undo: number;
    shuffle: number;
  };
  removedTiles: { id: string; type: string; isRemoved: boolean }[];
  onRemove: () => void;
  onUndo: () => void;
  onShuffle: () => void;
  onRemovedTileClick: () => void;
  disabled: boolean;
}

export function PropsPanel({
  props,
  removedTiles,
  onRemove,
  onUndo,
  onShuffle,
  onRemovedTileClick,
  disabled,
}: PropsPanelProps) {
  const availableRemovedTiles = removedTiles.filter(t => !t.isRemoved);

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {availableRemovedTiles.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={onRemovedTileClick}
            disabled={disabled}
            className="
              flex items-center gap-2 px-4 py-2
              bg-gradient-to-r from-amber-400 to-orange-500
              text-white font-bold rounded-full
              shadow-lg hover:shadow-xl
              transition-all duration-200
              hover:scale-105
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            "
          >
            <span className="text-lg">📦</span>
            <span>取回 ({availableRemovedTiles.length})</span>
          </button>
        </div>
      )}

      <div className="flex justify-center gap-3 md:gap-4">
        <button
          onClick={onRemove}
          disabled={disabled || props.remove <= 0}
          className="
            flex flex-col items-center gap-1 px-3 py-2 md:px-4 md:py-2
            bg-gradient-to-br from-pink-400 to-rose-500
            text-white rounded-xl md:rounded-2xl
            shadow-md hover:shadow-lg
            transition-all duration-200
            hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          <span className="text-xl md:text-2xl">🗑️</span>
          <span className="text-xs font-bold">移出</span>
          <span className="text-xs opacity-75">({props.remove})</span>
        </button>

        <button
          onClick={onUndo}
          disabled={disabled || props.undo <= 0}
          className="
            flex flex-col items-center gap-1 px-3 py-2 md:px-4 md:py-2
            bg-gradient-to-br from-blue-400 to-cyan-500
            text-white rounded-xl md:rounded-2xl
            shadow-md hover:shadow-lg
            transition-all duration-200
            hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          <span className="text-xl md:text-2xl">↩️</span>
          <span className="text-xs font-bold">撤销</span>
          <span className="text-xs opacity-75">({props.undo})</span>
        </button>

        <button
          onClick={onShuffle}
          disabled={disabled || props.shuffle <= 0}
          className="
            flex flex-col items-center gap-1 px-3 py-2 md:px-4 md:py-2
            bg-gradient-to-br from-purple-400 to-indigo-500
            text-white rounded-xl md:rounded-2xl
            shadow-md hover:shadow-lg
            transition-all duration-200
            hover:scale-105
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          <span className="text-xl md:text-2xl">🔀</span>
          <span className="text-xs font-bold">洗牌</span>
          <span className="text-xs opacity-75">({props.shuffle})</span>
        </button>
      </div>
    </div>
  );
}
