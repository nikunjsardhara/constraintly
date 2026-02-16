import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Square, Circle as CircleIcon, Type, ImageIcon, Trash2 } from "lucide-react";

interface ToolbarProps {
  showShapesTool: boolean;
  showTextTool: boolean;
  showImageTool: boolean;
  selectedObject: any;
  isLocked: boolean;
  onAddRect: () => void;
  onAddCircle: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onDelete: () => void;
}

export function Toolbar({
  showShapesTool,
  showTextTool,
  showImageTool,
  selectedObject,
  isLocked,
  onAddRect,
  onAddCircle,
  onAddText,
  onAddImage,
  onDelete,
}: ToolbarProps) {
  const disabledClass = isLocked ? "opacity-50 cursor-not-allowed" : "";

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4 flex-wrap">
        {showShapesTool && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onAddRect}
                  disabled={isLocked}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${disabledClass}`}
                >
                  <Square className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rectangle</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onAddCircle}
                  disabled={isLocked}
                  className={`w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${disabledClass}`}
                >
                  <CircleIcon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Circle</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}

        {showTextTool && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onAddText}
                disabled={isLocked}
                className={`w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${disabledClass}`}
              >
                <Type className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Text</p>
            </TooltipContent>
          </Tooltip>
        )}

        {showImageTool && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onAddImage}
                disabled={isLocked}
                className={`w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${disabledClass}`}
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Image (URL)</p>
            </TooltipContent>
          </Tooltip>
        )}

        {selectedObject && !isLocked && (
          <>
            <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onDelete}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
