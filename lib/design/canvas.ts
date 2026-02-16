import { Canvas, Rect, Circle, Ellipse, Triangle, Polygon, Line, Textbox, FabricImage, FabricObject } from "fabric";

export function createCanvas(canvasId: string, width: number, height: number): Canvas {
  const canvasEl = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvasEl) throw new Error("Canvas element not found");

  canvasEl.width = width;
  canvasEl.height = height;

  const canvas = new Canvas(canvasId, {
    preserveObjectStacking: true,
    backgroundColor: "#ffffff",
    selection: true,
  });

  return canvas;
}

export function disposeCanvas(canvas: Canvas | null): void {
  if (!canvas) return;
  try {
    canvas.off();
    canvas.dispose && canvas.dispose();
  } catch (e) {
    console.warn("Error disposing canvas", e);
  }
}

export function loadCanvasFromSession(canvas: Canvas, session: any, onLoad?: () => void): void {
  const existingCanvas = session?.challengeData?.canvasData || session?.challengeData?.canvas;
  if (existingCanvas) {
    try {
      canvas.loadFromJSON(existingCanvas, () => {
        canvas.renderAll();
        onLoad?.();
      });
    } catch (e) {
      console.warn("Failed to load existing canvas", e);
      onLoad?.();
    }
  } else {
    onLoad?.();
  }
}

export function addRectangle(
  canvas: Canvas,
  options: { fill: string; stroke: string; strokeWidth: number }
): void {
  const rect = new Rect({
    left: 60,
    top: 60,
    width: 180,
    height: 120,
    ...options,
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
}

export function addCircle(
  canvas: Canvas,
  options: { fill: string; stroke: string; strokeWidth: number }
): void {
  const circ = new Circle({
    left: 80,
    top: 80,
    radius: 60,
    ...options,
  });
  canvas.add(circ);
  canvas.setActiveObject(circ);
  canvas.requestRenderAll();
}

export function addTriangle(
  canvas: Canvas,
  options: { fill: string; stroke: string; strokeWidth: number }
): void {
  const triangle = new Triangle({
    left: 80,
    top: 80,
    width: 120,
    height: 100,
    ...options,
  });
  canvas.add(triangle);
  canvas.setActiveObject(triangle);
  canvas.requestRenderAll();
}

export function addEllipse(
  canvas: Canvas,
  options: { fill: string; stroke: string; strokeWidth: number }
): void {
  const ellipse = new Ellipse({
    left: 80,
    top: 80,
    rx: 80,
    ry: 50,
    ...options,
  });
  canvas.add(ellipse);
  canvas.setActiveObject(ellipse);
  canvas.requestRenderAll();
}

export function addPolygon(
  canvas: Canvas,
  options: { fill: string; stroke: string; strokeWidth: number; sides?: number }
): void {
  const sides = options.sides || 5;
  const radius = 60;
  const points = [];
  
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }

  const polygon = new Polygon(points, {
    left: 80,
    top: 80,
    fill: options.fill,
    stroke: options.stroke,
    strokeWidth: options.strokeWidth,
  } as any);
  canvas.add(polygon);
  canvas.setActiveObject(polygon);
  canvas.requestRenderAll();
}

export function addLine(
  canvas: Canvas,
  options: { stroke: string; strokeWidth: number }
): void {
  const line = new Line([60, 60, 200, 60], {
    left: 60,
    top: 60,
    stroke: options.stroke,
    strokeWidth: options.strokeWidth,
  } as any);
  canvas.add(line);
  canvas.setActiveObject(line);
  canvas.requestRenderAll();
}

export function addText(
  canvas: Canvas,
  options: { fill: string; fontFamily: string; fontSize: number; fontStyle: any }
): void {
  const style: any = {};
  if (options.fontStyle.bold) style.fontWeight = "bold";
  if (options.fontStyle.italic) style.fontStyle = "italic";
  if (options.fontStyle.underline) style.underline = true;

  const text = new Textbox("New text", {
    left: 100,
    top: 100,
    width: 300,
    fontSize: options.fontSize,
    fontFamily: options.fontFamily,
    fill: options.fill,
    ...style,
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.requestRenderAll();
}

export async function addImage(canvas: Canvas, url: string): Promise<void> {
  try {
    const img = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
    const maxW = canvas.getWidth() * 0.6;
    const maxH = canvas.getHeight() * 0.6;
    const scale = Math.min(maxW / (img.width || maxW), maxH / (img.height || maxH), 1);
    img.set({ left: 60, top: 60, scaleX: scale, scaleY: scale });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
  } catch (err) {
    console.error("Failed to load image", err);
    throw err;
  }
}

export function deleteSelectedObject(canvas: Canvas): void {
  const active = canvas.getActiveObject();
  if (!active) return;
  canvas.remove(active);
  canvas.requestRenderAll();
}

export function applyFill(canvas: Canvas, color: string): void {
  const active = canvas.getActiveObject();
  if (!active) return;
  active.set({ fill: color });
  canvas.requestRenderAll();
}

export function applyStroke(canvas: Canvas, color: string): void {
  const active = canvas.getActiveObject();
  if (!active) return;
  active.set({ stroke: color });
  canvas.requestRenderAll();
}

export function applyStrokeWidth(canvas: Canvas, width: number): void {
  const active = canvas.getActiveObject();
  if (!active) return;
  active.set({ strokeWidth: width });
  canvas.requestRenderAll();
}

export function applyFontFamily(canvas: Canvas, fontFamily: string): void {
  const active = canvas.getActiveObject();
  if (!active || !active.type?.includes("text")) return;
  active.set({ fontFamily });
  canvas.requestRenderAll();
}

export function applyFontSize(canvas: Canvas, fontSize: number): void {
  const active = canvas.getActiveObject();
  if (!active || !active.type?.includes("text")) return;
  active.set({ fontSize });
  canvas.requestRenderAll();
}

export function applyFontStyles(canvas: Canvas, style: { bold: boolean; italic: boolean; underline: boolean }): void {
  const active = canvas.getActiveObject();
  if (!active || !active.type?.includes("text")) return;
  active.set({
    fontWeight: style.bold ? "bold" : "normal",
    fontStyle: style.italic ? "italic" : "normal",
    underline: style.underline,
  });
  canvas.requestRenderAll();
}

export function downloadCanvas(canvas: Canvas, filename: string): void {
  const dataURL = canvas.toDataURL({ format: "png", multiplier: 1 });
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function getSelectedObjectProperties(obj: any) {
  if (!obj) return null;
  return {
    fill: obj.fill || "#FF5722",
    stroke: obj.stroke || "#000000",
    strokeWidth: obj.strokeWidth || 1,
    fontFamily: obj.fontFamily || "Arial",
    fontSize: obj.fontSize || 36,
    fontStyle: {
      bold: obj.fontWeight === "bold",
      italic: obj.fontStyle === "italic",
      underline: obj.underline || false,
    },
    isText: obj.type?.includes("text"),
  };
}

export function setCanvasZoom(canvas: Canvas, zoom: number): void {
  canvas.setZoom(zoom);
  canvas.renderAll();
}

export function zoomToFit(
  canvas: Canvas,
  containerWidth: number,
  containerHeight: number,
  originalWidth: number,
  originalHeight: number
): number {
  const padding = 60;
  const maxWidth = containerWidth - padding;
  const maxHeight = containerHeight - padding;
  
  const scaleX = maxWidth / originalWidth;
  const scaleY = maxHeight / originalHeight;
  const scale = Math.min(scaleX, scaleY, 1);
  
  const newWidth = originalWidth * scale;
  const newHeight = originalHeight * scale;
  
  canvas.setDimensions({ width: newWidth, height: newHeight });
  canvas.setZoom(scale);
  canvas.renderAll();
  
  return scale;
}

export function zoomIn(canvas: Canvas, currentZoom: number, step: number = 0.1): number {
  const newZoom = Math.min(currentZoom + step, 3);
  canvas.setZoom(newZoom);
  canvas.renderAll();
  return newZoom;
}

export function zoomOut(canvas: Canvas, currentZoom: number, step: number = 0.1): number {
  const newZoom = Math.max(currentZoom - step, 0.1);
  canvas.setZoom(newZoom);
  canvas.renderAll();
  return newZoom;
}

export function resetCanvasZoom(canvas: Canvas, originalWidth: number, originalHeight: number): number {
  const container = canvas.getElement().parentElement;
  if (!container) return 1;
  
  return zoomToFit(canvas, container.clientWidth, container.clientHeight, originalWidth, originalHeight);
}
