import { SHAPE_TYPES } from "../constants/design";

export interface ChallengeData {
  constraints?: string[];
  canvasData?: any;
  canvas?: any;
}

export interface DesignSession {
  challengeData?: ChallengeData;
}

export function getConstraints(session: DesignSession | null): string[] {
  return (session?.challengeData?.constraints || []) as string[];
}

export function isTextAllowed(constraints: string[]): boolean {
  return !constraints.some((c) => {
    const low = (c || "").toLowerCase();
    return low.includes("no text") || low.includes("no type") || low.includes("text forbidden");
  });
}

export function isShapesAllowed(constraints: string[]): boolean {
  return !constraints.some((c) => {
    const low = (c || "").toLowerCase();
    return low.includes("no shapes") || low.includes("shapes forbidden");
  });
}

export function isImagesAllowed(constraints: string[]): boolean {
  return !constraints.some((c) => {
    const low = (c || "").toLowerCase();
    return (
      low.includes("no images") ||
      low.includes("images forbidden") ||
      low.includes("no photos")
    );
  });
}

export function checkViolations(
  canvas: any,
  constraints: string[]
): string[] {
  if (!canvas) return [];
  
  const found: string[] = [];
  const objects = canvas.getObjects();
  const shapesCount = objects.filter((o: any) => SHAPE_TYPES.includes(o.type)).length;

  for (const c of constraints) {
    const low = (c || "").toLowerCase();

    if (low.includes("no text") || low.includes("no type") || low.includes("text forbidden")) {
      const hasText = objects.some((o: any) => (o.type || "").includes("text"));
      if (hasText) found.push("No text allowed by challenge");
    }

    const shapesMatch = c.match(/(\d+)\s*(?:shapes|layers)/i);
    if (shapesMatch) {
      const limit = Number(shapesMatch[1]);
      if (shapesCount > limit) {
        found.push(`Only ${limit} shapes allowed (you have ${shapesCount})`);
      }
    }

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
      if (colorSet.size > limit) {
        found.push(`Only ${limit} colors allowed (you use ${colorSet.size})`);
      }
    }
  }

  return found;
}
