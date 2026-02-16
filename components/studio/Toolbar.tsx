import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Square, Circle as CircleIcon, Triangle, Hexagon, Type, ImageIcon, Trash2, Minus, Pentagon } from "lucide-react";
import { SHAPE_DEFINITIONS, ShapeType } from "@/lib/constants/design";

interface ToolbarProps {
  showShapesTool: boolean;
  showTextTool: boolean;
  showImageTool: boolean;
  selectedObject: any;
  isLocked: boolean;
  forbiddenShapes: string[];
  onAddShape: (shapeType: ShapeType) => void;
  onAddText: () => void;
  onAddImage: () => void;
  onDelete: () => void;
}

const shapeIcons: Record<ShapeType, React.ElementType> = {
  rect: Square,
  circle: CircleIcon,
  triangle: Triangle,
  ellipse: Pentagon,
  polygon: Hexagon,
  line: Minus,
};

export function Toolbar({
  showShapesTool,
  showTextTool,
  showImageTool,
  selectedObject,
  isLocked,
  forbiddenShapes,
  onAddShape,
  onAddText,
  onAddImage,
  onDelete,
}: ToolbarProps) {
  const disabledClass = isLocked ? "opacity-50 cursor-not-allowed" : "";

  const availableShapes = Object.keys(SHAPE_DEFINITIONS) as ShapeType[];

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4 flex-wrap">
        {showShapesTool && (
          <>
            {availableShapes.map((shapeType) => {
              const isForbidden = forbiddenShapes.includes(shapeType);
              const Icon = shapeIcons[shapeType];
              const definition = SHAPE_DEFINITIONS[shapeType];
              
              return (
                <Tooltip key={shapeType}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onAddShape(shapeType)}
                      disabled={isLocked || isForbidden}
                      className={`w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${disabledClass} ${isForbidden ? "opacity-30" : ""}`}
                      title={isForbidden ? `${definition.label} not allowed` : definition.label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isForbidden ? `${definition.label} (not allowed)` : definition.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
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
