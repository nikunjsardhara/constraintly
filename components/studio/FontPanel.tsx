import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FONTS } from "@/lib/constants/design";
import { Bold, Italic, Underline } from "lucide-react";

interface FontPanelProps {
  isTextSelected: boolean;
  isLocked: boolean;
  fontFamily: string;
  fontSize: number;
  fontStyle: { bold: boolean; italic: boolean; underline: boolean };
  onFontFamilyChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onFontStyleChange: (style: "bold" | "italic" | "underline") => void;
}

export function FontPanel({
  isTextSelected,
  isLocked,
  fontFamily,
  fontSize,
  fontStyle,
  onFontFamilyChange,
  onFontSizeChange,
  onFontStyleChange,
}: FontPanelProps) {
  if (!isTextSelected || isLocked) return null;

  return (
    <>
      <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

      <div className="flex items-center gap-1">
        <select
          value={fontFamily}
          onChange={(e) => onFontFamilyChange(e.target.value)}
          className="text-xs p-1 border rounded bg-white dark:bg-zinc-800"
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <input
          type="number"
          min="8"
          max="200"
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          onBlur={() => isTextSelected && onFontSizeChange(fontSize)}
          className="w-12 text-xs p-1 border rounded bg-white dark:bg-zinc-800"
        />
      </div>

      <TooltipProvider>
        <div className="flex gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onFontStyleChange("bold")}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                  fontStyle.bold
                    ? "bg-zinc-800 text-white dark:bg-white dark:text-black"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Bold className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onFontStyleChange("italic")}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                  fontStyle.italic
                    ? "bg-zinc-800 text-white dark:bg-white dark:text-black"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Italic className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onFontStyleChange("underline")}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                  fontStyle.underline
                    ? "bg-zinc-800 text-white dark:bg-white dark:text-black"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <Underline className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Underline</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </>
  );
}
