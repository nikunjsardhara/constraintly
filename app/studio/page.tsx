"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { fabric } from "fabric";

const FORMAT_SIZES: Record<string, { width: number; height: number }> = {
  instagram: { width: 1080, height: 1080 },
  logo: { width: 800, height: 800 },
  youtube_thumbnail: { width: 1280, height: 720 },
  youtube_banner: { width: 2560, height: 1440 },
  facebook_banner: { width: 820, height: 312 },
  linkedin_banner: { width: 1584, height: 396 },
  twitter_post: { width: 1200, height: 675 },
  presentation: { width: 1920, height: 1080 },
};

export default function StudioPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("sessionId");
  const format = searchParams?.get("format") || "instagram";
  const [session, setSession] = useState<any>(null);
  const [violations, setViolations] = useState<string[]>([]);
  const [fillColor, setFillColor] = useState<string>("#FF5722");
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!sessionId) return;
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    const size = FORMAT_SIZES[format] || FORMAT_SIZES["instagram"];

    // remove old canvas if exists
    try {
      if (fabricRef.current) {
        fabricRef.current.off();
        fabricRef.current.dispose && fabricRef.current.dispose();
        fabricRef.current = null;
      }
    } catch (e) {
      // ignore
    }

    // ensure a canvas element exists
    const canvasEl = document.getElementById("studio-canvas") as HTMLCanvasElement | null;
    if (!canvasEl) return;
    canvasEl.width = size.width;
    canvasEl.height = size.height;

    const canvas = new fabric.Canvas("studio-canvas", {
      preserveObjectStacking: true,
      backgroundColor: "#ffffff",
      selection: true,
    });

    fabricRef.current = canvas;

    // load previous work if present
    const existingCanvas = session?.challengeData?.canvasData || session?.challengeData?.canvas;
    if (existingCanvas) {
      try {
        canvas.loadFromJSON(existingCanvas, () => {
          canvas.renderAll();
          checkViolations();
        });
      } catch (e) {
        console.warn("Failed to load existing canvas", e);
      }
    } else {
      checkViolations();
    }

    canvas.on("object:added", checkViolations);
    canvas.on("object:modified", checkViolations);
    canvas.on("object:removed", checkViolations);

    return () => {
      canvas.off();
      canvas.dispose && canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, session?.id, format]);

  function getConstraints(): string[] {
    return (session?.challengeData?.constraints || session?.challengeData?.constraints || []) as string[];
  }

  function checkViolations() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const constraints = getConstraints();
    const found: string[] = [];

    // Count shapes
    const shapeTypes = ["rect", "circle", "ellipse", "triangle", "polygon", "path"];
    const objects = canvas.getObjects();
    const shapesCount = objects.filter((o: any) => shapeTypes.includes(o.type)).length;

    for (const c of constraints) {
      const low = (c || "").toLowerCase();

      // No text
      if (low.includes("no text") || low.includes("no type") || low.includes("text forbidden")) {
        const hasText = objects.some((o: any) => (o.type || "").includes("text"));
        if (hasText) found.push("No text allowed by challenge");
      }

      // Shapes limit (e.g., "2 shapes max" or "limit to 2 layers")
      const shapesMatch = c.match(/(\d+)\s*(?:shapes|layers)/i);
      if (shapesMatch) {
        const limit = Number(shapesMatch[1]);
        if (shapesCount > limit) found.push(`Only ${limit} shapes allowed (you have ${shapesCount})`);
      }

      // Colors limit (e.g., "3 colors only")
      const colorsMatch = c.match(/(\d+)\s*(?:colors)/i);
      if (colorsMatch) {
        const limit = Number(colorsMatch[1]);
        const colorSet = new Set<string>();
        objects.forEach((o: any) => {
          const fill = o.fill;
          if (typeof fill === "string") colorSet.add(fill);
          const stroke = o.stroke;
          if (typeof stroke === "string") colorSet.add(stroke);
        });
        if (colorSet.size > limit) found.push(`Only ${limit} colors allowed (you use ${colorSet.size})`);
      }
    }

    setViolations(found);
  }

  function addRect() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const rect = new fabric.Rect({ left: 60, top: 60, width: 180, height: 120, fill: fillColor, stroke: strokeColor, strokeWidth: 1 });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();
  }

  function addCircle() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const circ = new fabric.Circle({ left: 80, top: 80, radius: 60, fill: fillColor, stroke: strokeColor, strokeWidth: 1 });
    canvas.add(circ);
    canvas.setActiveObject(circ);
    canvas.requestRenderAll();
  }

  function addText() {
    const constraints = getConstraints();
    if (constraints.some((c) => (c || "").toLowerCase().includes("no text"))) {
      alert("This challenge forbids text.");
      return;
    }
    const canvas = fabricRef.current;
    if (!canvas) return;
    const t = new fabric.Textbox("New text", { left: 100, top: 100, width: 300, fontSize: 36, fill: strokeColor });
    canvas.add(t);
    canvas.setActiveObject(t);
    canvas.requestRenderAll();
  }

  async function addImage() {
    const url = prompt("Image URL");
    if (!url) return;
    const canvas = fabricRef.current;
    if (!canvas) return;
    try {
      fabric.Image.fromURL(url, (img) => {
        const maxW = canvas.getWidth() * 0.6;
        const maxH = canvas.getHeight() * 0.6;
        const scale = Math.min(maxW / (img.width || maxW), maxH / (img.height || maxH), 1);
        img.set({ left: 60, top: 60, scaleX: scale, scaleY: scale });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
      }, { crossOrigin: 'anonymous' });
    } catch (err) {
      console.error('Failed to load image', err);
      alert('Failed to load image');
    }
  }

  async function saveCanvas() {
    const canvas = fabricRef.current;
    if (!canvas || !sessionId) return;
    try {
      setIsSaving(true);
      const json = canvas.toJSON();
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ canvasData: json }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        alert("Save failed: " + (text || res.status));
      } else {
        alert("Canvas saved");
      }
    } catch (err) {
      console.error(err);
      alert("Save error");
    } finally {
      setIsSaving(false);
    }
  }

  async function endSessionWithSave() {
    const canvas = fabricRef.current;
    if (!canvas || !sessionId) return;
    try {
      setIsSaving(true);
      const json = canvas.toJSON();
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ canvasData: json, status: "COMPLETED", endedAt: new Date().toISOString() }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Studio</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={saveCanvas} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
            <Button variant="destructive" onClick={endSessionWithSave}>End Session</Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-3">
            <Card className="p-4 mb-4">
              <div className="text-sm text-zinc-600 mb-2">Session</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white">{session?.challengeTitle || 'Untitled'}</div>
              <div className="text-xs text-zinc-500 mt-1">{format}</div>

              <div className="mt-4">
                <div className="text-sm font-medium">Constraints</div>
                <ul className="mt-2 space-y-1 text-sm text-zinc-700 dark:text-zinc-200">
                  {getConstraints().map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>

                <div className="mt-4">
                  <div className="text-sm font-medium">Colors</div>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} />
                    <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium">Tools</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <Button onClick={addRect}>Add Rectangle</Button>
                    <Button onClick={addCircle}>Add Circle</Button>
                    <Button onClick={addText}>Add Text</Button>
                    <Button onClick={addImage}>Add Image (URL)</Button>
                  </div>
                </div>

                {violations.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
                    <div className="font-semibold">Constraint violations</div>
                    <ul className="text-sm mt-2">
                      {violations.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-sm font-medium mb-2">Save & Export</div>
              <div className="flex flex-col gap-2">
                <Button onClick={saveCanvas}>Save progress</Button>
                <Button onClick={() => {
                  const c = fabricRef.current;
                  if (!c) return;
                  const data = c.toDataURL({ format: 'png', multiplier: 1 });
                  const a = document.createElement('a');
                  a.href = data;
                  a.download = `${session?.challengeTitle || 'design'}.png`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }}>Download PNG</Button>
              </div>
            </Card>
          </aside>

          <main className="col-span-9">
            <Card className="p-4">
              <div className="border rounded-md overflow-hidden">
                <div className="w-full overflow-auto" style={{ maxHeight: '80vh' }}>
                  <canvas id="studio-canvas" ref={canvasRef} className="w-full" />
                </div>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
