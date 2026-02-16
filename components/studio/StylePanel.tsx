interface StylePanelProps {
  selectedObject: any;
  isLocked: boolean;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  onFillChange: (color: string) => void;
  onStrokeChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
}

export function StylePanel({
  selectedObject,
  isLocked,
  fillColor,
  strokeColor,
  strokeWidth,
  onFillChange,
  onStrokeChange,
  onStrokeWidthChange,
}: StylePanelProps) {
  const disabled = isLocked || !selectedObject;

  return (
    <>
      <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

      <div className="flex items-center gap-2">
        <label className="text-xs text-zinc-500">Fill</label>
        <input
          type="color"
          value={fillColor}
          disabled={disabled}
          onChange={(e) => onFillChange(e.target.value)}
          onBlur={() => selectedObject && onFillChange(fillColor)}
          className={`w-6 h-6 cursor-pointer rounded ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-zinc-500">Stroke</label>
        <input
          type="color"
          value={strokeColor}
          disabled={disabled}
          onChange={(e) => onStrokeChange(e.target.value)}
          onBlur={() => selectedObject && onStrokeChange(strokeColor)}
          className={`w-6 h-6 cursor-pointer rounded ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>

      <div className="flex items-center gap-1">
        <label className="text-xs text-zinc-500">W</label>
        <input
          type="range"
          min="0"
          max="20"
          value={strokeWidth}
          disabled={disabled}
          onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
          onMouseUp={() => selectedObject && onStrokeWidthChange(strokeWidth)}
          className={`w-16 h-1.5 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>
    </>
  );
}
