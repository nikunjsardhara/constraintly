import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onResetZoom: () => void;
}

export function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onResetZoom,
}: ZoomControlsProps) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        className="w-8 h-8 p-0"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      
      <span className="text-xs min-w-[48px] text-center text-zinc-600 dark:text-zinc-400">
        {zoomPercent}%
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        className="w-8 h-8 p-0"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-600 mx-1" />
      
      <Button
        variant="outline"
        size="sm"
        onClick={onFitToScreen}
        className="w-8 h-8 p-0"
        title="Fit to Screen"
      >
        <Maximize2 className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onResetZoom}
        className="w-8 h-8 p-0"
        title="Reset Zoom (100%)"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
}
