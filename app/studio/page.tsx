"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Canvas } from "fabric";
import { Download, Save, X } from "lucide-react";

import { FORMAT_SIZES, DEFAULT_COLORS, AUTO_SAVE_INTERVAL, ShapeType } from "@/lib/constants/design";
import {
  getConstraints,
  isTextAllowed,
  isShapesAllowed,
  isImagesAllowed,
  isShapeAllowed,
  getForbiddenShapes,
  checkViolations,
} from "@/lib/design/constraints";
import {
  createCanvas,
  disposeCanvas,
  loadCanvasFromSession,
  addRectangle,
  addCircle,
  addTriangle,
  addEllipse,
  addPolygon,
  addLine,
  addText,
  addImage,
  deleteSelectedObject,
  applyFill,
  applyStroke,
  applyStrokeWidth,
  applyFontFamily,
  applyFontSize,
  applyFontStyles,
  downloadCanvas,
  getSelectedObjectProperties,
} from "@/lib/design/canvas";
import { saveCanvasSession, saveThumbnail, fetchSession } from "@/lib/api/sessions";

import {
  Toolbar,
  StylePanel,
  FontPanel,
  TimerDisplay,
  ViolationsAlert,
  ZoomControls,
} from "@/components/studio";

function StudioContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("sessionId");
  const format = searchParams?.get("format") || "instagram";

  const [session, setSession] = useState<any>(null);
  const [violations, setViolations] = useState<string[]>([]);
  const [fillColor, setFillColor] = useState<string>(DEFAULT_COLORS.fill);
  const [strokeColor, setStrokeColor] = useState<string>(DEFAULT_COLORS.stroke);
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontSize, setFontSize] = useState<number>(36);
  const [fontStyle, setFontStyle] = useState<{ bold: boolean; italic: boolean; underline: boolean }>({
    bold: false,
    italic: false,
    underline: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();

  const constraints = getConstraints(session);
  const showTextTool = isTextAllowed(constraints);
  const showShapesTool = isShapesAllowed(constraints);
  const showImageTool = isImagesAllowed(constraints);
  const forbiddenShapes = getForbiddenShapes(constraints);
  const isTextSelected = selectedObject?.type?.includes("text");

  useEffect(() => {
    if (!sessionId) return;

    const loadSession = async () => {
      const data = await fetchSession(sessionId);
      if (data) {
        setSession(data);
        if (data.plannedDuration) {
          const started = new Date(data.startedAt).getTime();
          const endTime = started + data.plannedDuration * 60 * 1000;
          const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
          setTimeLeft(remaining);
          setTimerActive(true);
        }
      }
    };
    loadSession();
  }, [sessionId]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          lockCanvas();
          handleSave(true);
          alert("Time's up! Your work has been saved automatically.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (!sessionId) return;

    const autoSaveInterval = setInterval(() => {
      handleSave(true);
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSaveInterval);
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !session) return;

    const size = FORMAT_SIZES[format] || FORMAT_SIZES.instagram;
    setCanvasSize({ width: size.width, height: size.height });

    if (fabricRef.current) {
      disposeCanvas(fabricRef.current);
      fabricRef.current = null;
    }

    const canvas = createCanvas("studio-canvas", size.width, size.height);
    fabricRef.current = canvas;

    loadCanvasFromSession(canvas, session, () => {
      setViolations(checkViolations(canvas, constraints));
      
      setTimeout(() => {
        if (fabricRef.current) {
          fabricRef.current.setZoom(1);
          fabricRef.current.renderAll();
        }
        handleFitToScreen();
      }, 100);
    });

    canvas.on("selection:created", (e: any) => handleSelectionChange(e.selected?.[0]));
    canvas.on("selection:updated", (e: any) => handleSelectionChange(e.selected?.[0]));
    canvas.on("selection:cleared", () => setSelectedObject(null));

    canvas.on("object:added", () => setViolations(checkViolations(canvas, constraints)));
    canvas.on("object:modified", () => setViolations(checkViolations(canvas, constraints)));
    canvas.on("object:removed", () => setViolations(checkViolations(canvas, constraints)));

    return () => {
      if (fabricRef.current) {
        disposeCanvas(fabricRef.current);
        fabricRef.current = null;
      }
    };
  }, [sessionId, session?.id, format]);

  function handleSelectionChange(obj: any) {
    setSelectedObject(obj);
    if (obj) {
      const props = getSelectedObjectProperties(obj);
      if (props) {
        setFillColor(props.fill);
        setStrokeColor(props.stroke);
        setStrokeWidth(props.strokeWidth);
        if (props.isText) {
          setFontFamily(props.fontFamily);
          setFontSize(props.fontSize);
          setFontStyle(props.fontStyle);
        }
      }
    }
  }

  function handleAddShape(shapeType: ShapeType) {
    if (!showShapesTool) {
      alert("Shapes are not allowed in this challenge");
      return;
    }
    if (!isShapeAllowed(constraints, shapeType)) {
      alert(`${shapeType} is not allowed in this challenge`);
      return;
    }
    const canvas = fabricRef.current;
    if (!canvas) return;
    
    const options = { fill: fillColor, stroke: strokeColor, strokeWidth };
    
    switch (shapeType) {
      case "rect":
        addRectangle(canvas, options);
        break;
      case "circle":
        addCircle(canvas, options);
        break;
      case "triangle":
        addTriangle(canvas, options);
        break;
      case "ellipse":
        addEllipse(canvas, options);
        break;
      case "polygon":
        addPolygon(canvas, options);
        break;
      case "line":
        addLine(canvas, { stroke: strokeColor, strokeWidth });
        break;
    }
    
    setViolations(checkViolations(canvas, constraints));
  }

  function handleAddText() {
    if (!showTextTool) {
      alert("Text is not allowed in this challenge.");
      return;
    }
    const canvas = fabricRef.current;
    if (!canvas) return;
    addText(canvas, { fill: fillColor, fontFamily, fontSize, fontStyle });
    setViolations(checkViolations(canvas, constraints));
  }

  async function handleAddImage() {
    if (!showImageTool) {
      alert("Images are not allowed in this challenge");
      return;
    }
    const url = prompt("Image URL");
    if (!url) return;
    const canvas = fabricRef.current;
    if (!canvas) return;
    try {
      await addImage(canvas, url);
      setViolations(checkViolations(canvas, constraints));
    } catch {
      alert("Failed to load image");
    }
  }

  function handleDelete() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    deleteSelectedObject(canvas);
    setSelectedObject(null);
    setViolations(checkViolations(canvas, constraints));
  }

  function handleFillChange(color: string) {
    setFillColor(color);
    const canvas = fabricRef.current;
    if (!canvas) return;
    applyFill(canvas, color);
    setViolations(checkViolations(canvas, constraints));
  }

  function handleStrokeChange(color: string) {
    setStrokeColor(color);
    const canvas = fabricRef.current;
    if (!canvas) return;
    applyStroke(canvas, color);
    setViolations(checkViolations(canvas, constraints));
  }

  function handleStrokeWidthChange(width: number) {
    setStrokeWidth(width);
    const canvas = fabricRef.current;
    if (!canvas) return;
    applyStrokeWidth(canvas, width);
  }

  function handleFontFamilyChange(font: string) {
    setFontFamily(font);
    const canvas = fabricRef.current;
    if (!canvas) return;
    applyFontFamily(canvas, font);
  }

  function handleFontSizeChange(size: number) {
    setFontSize(size);
    const canvas = fabricRef.current;
    if (!canvas) return;
    applyFontSize(canvas, size);
  }

  function handleFontStyleChange(styleType: "bold" | "italic" | "underline") {
    const newStyle = { ...fontStyle };
    newStyle[styleType] = !newStyle[styleType];
    setFontStyle(newStyle);
    const canvas = fabricRef.current;
    if (!canvas) return;
    applyFontStyles(canvas, newStyle);
  }

  async function handleSave(auto = false) {
    const canvas = fabricRef.current;
    if (!canvas || !sessionId) return;
    setIsSaving(true);
    const canvasData = canvas.toJSON();
    await saveCanvasSession({ sessionId, canvasData, auto });
    setIsSaving(false);
  }

  async function handleEndSession() {
    const canvas = fabricRef.current;
    if (!canvas || !sessionId) return;
    try {
      setIsSaving(true);
      lockCanvas();
      const canvasData = canvas.toJSON();
      const thumbnailPath = await saveThumbnail(sessionId, canvas);

      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          canvasData,
          status: "COMPLETED",
          endedAt: new Date().toISOString(),
          thumbnail: thumbnailPath,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
      router.push("/dashboard");
    }
  }

  function handleDownload() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    downloadCanvas(canvas, session?.challengeTitle || "design");
  }

  function lockCanvas() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.forEachObject((obj: any) => {
      obj.selectable = false;
      obj.evented = false;
    });
    canvas.renderAll();
    setIsLocked(true);
  }

  function handleZoomIn() {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  }

  function handleZoomOut() {
    setZoom((prev) => Math.max(prev - 0.25, 0.25));
  }

  function handleFitToScreen() {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;
    
    const scaleX = containerWidth / canvasSize.width;
    const scaleY = containerHeight / canvasSize.height;
    const newZoom = Math.min(scaleX, scaleY, 1);
    
    setZoom(newZoom);
  }

  function handleResetZoom() {
    setZoom(1);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-4">
      <div className="max-w-[98vw] mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {session?.challengeTitle || "Studio"}
              </h1>
              {session?.challengeData?.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {session.challengeData.description}
                </p>
              )}
            </div>
            <TimerDisplay timeLeft={timeLeft} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave(false)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button variant="destructive" onClick={handleEndSession}>
              <X className="w-4 h-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-2">
            <div className="flex items-center gap-4 flex-wrap">
              <Toolbar
                showShapesTool={showShapesTool}
                showTextTool={showTextTool}
                showImageTool={showImageTool}
                selectedObject={selectedObject}
                isLocked={isLocked}
                forbiddenShapes={forbiddenShapes}
                onAddShape={handleAddShape}
                onAddText={handleAddText}
                onAddImage={handleAddImage}
                onDelete={handleDelete}
              />

              <StylePanel
                selectedObject={selectedObject}
                isLocked={isLocked}
                fillColor={fillColor}
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                onFillChange={handleFillChange}
                onStrokeChange={handleStrokeChange}
                onStrokeWidthChange={handleStrokeWidthChange}
              />

              {showTextTool && (
                <FontPanel
                  isTextSelected={isTextSelected}
                  isLocked={isLocked}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontStyle={fontStyle}
                  onFontFamilyChange={handleFontFamilyChange}
                  onFontSizeChange={handleFontSizeChange}
                  onFontStyleChange={handleFontStyleChange}
                />
              )}

              <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>

              <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

              <ZoomControls
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onFitToScreen={handleFitToScreen}
                onResetZoom={handleResetZoom}
              />

              <span className="text-xs text-zinc-500 ml-2">
                {canvasSize.width} × {canvasSize.height}
              </span>
            </div>
          </Card>

          <ViolationsAlert violations={violations} />

          <main>
            <Card className="p-1">
              <div 
                ref={containerRef}
                className="border border-zinc-200 dark:border-zinc-700 rounded-md overflow-auto bg-zinc-50 dark:bg-zinc-900 relative"
                style={{ height: "calc(100vh - 220px)", minHeight: "400px" }}
              >
                <div 
                  className="bg-white shadow-xl relative"
                  style={{ 
                    width: canvasSize.width * zoom, 
                    height: canvasSize.height * zoom,
                    transformOrigin: 'top left',
                  }}
                >
                  <canvas id="studio-canvas" ref={canvasRef} style={{ width: canvasSize.width, height: canvasSize.height }} />
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                        Session Ended
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <StudioContent />
    </Suspense>
  );
}
