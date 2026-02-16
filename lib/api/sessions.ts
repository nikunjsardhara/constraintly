interface SaveOptions {
  sessionId: string;
  canvasData: any;
  auto?: boolean;
}

interface EndSessionOptions {
  sessionId: string;
  canvas: any;
  title?: string;
}

async function handleResponse(res: Response, auto: boolean): Promise<boolean> {
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    if (!auto) alert("Save failed: " + (text || res.status));
    return false;
  }
  if (!auto) alert("Canvas saved");
  return true;
}

export async function saveCanvasSession({ sessionId, canvasData, auto = false }: SaveOptions): Promise<boolean> {
  try {
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ canvasData }),
    });
    return handleResponse(res, auto);
  } catch (err) {
    console.error(err);
    if (!auto) alert("Save error");
    return false;
  }
}

export async function saveThumbnail(sessionId: string, canvas: any): Promise<string | null> {
  try {
    const dataURL = canvas.toDataURL({ format: "png", multiplier: 1, quality: 1 });
    const base64Data = dataURL.replace(/^data:image\/png;base64,/, "");

    const res = await fetch("/api/sessions/thumbnail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sessionId, imageData: base64Data }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.path;
    }
    return null;
  } catch (err) {
    console.error("Failed to save thumbnail", err);
    return null;
  }
}

export async function endDesignSession({ sessionId, canvas }: EndSessionOptions): Promise<void> {
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
}

export async function fetchSession(sessionId: string): Promise<any> {
  const res = await fetch(`/api/sessions/${sessionId}`, { credentials: "include" });
  if (res.ok) {
    return await res.json();
  }
  return null;
}
