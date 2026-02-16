import { SHAPE_TYPES } from "../constants/design";
import {
  Constraint,
  ConstraintType,
} from "../constants/constraints";

export interface ChallengeData {
  constraints?: Constraint[];
  canvasData?: any;
  canvas?: any;
}

export interface DesignSession {
  challengeData?: ChallengeData;
}

export function getConstraints(session: DesignSession | null): Constraint[] {
  const raw = session?.challengeData?.constraints;
  if (!raw) return [];
  
  if (Array.isArray(raw) && raw.length > 0) {
    if (typeof raw[0] === "string") {
      return parseLegacyConstraints(raw as unknown as string[]);
    }
    return raw as Constraint[];
  }
  
  return [];
}

function parseLegacyConstraints(constraints: string[]): Constraint[] {
  return constraints.map((c) => {
    const low = c.toLowerCase();
    
    if (low.includes("no text") || low.includes("no type")) {
      return { type: "FORBIDDEN_TOOLS", value: ["text"], description: c };
    }
    if (low.includes("no shapes")) {
      return { type: "FORBIDDEN_TOOLS", value: ["shapes"], description: c };
    }
    if (low.includes("no images") || low.includes("no photos")) {
      return { type: "FORBIDDEN_TOOLS", value: ["images"], description: c };
    }
    
    const shapesMatch = c.match(/(\d+)\s*(?:shapes|layers)/i);
    if (shapesMatch) {
      return { type: "MAX_SHAPES", value: parseInt(shapesMatch[1], 10), description: c };
    }
    
    const colorsMatch = c.match(/(\d+)\s*(?:colors?)/i);
    if (colorsMatch) {
      const num = parseInt(colorsMatch[1], 10);
      if (low.includes("minimum") || low.includes("at least")) {
        return { type: "MIN_COLORS", value: num, description: c };
      }
      return { type: "MAX_COLORS", value: num, description: c };
    }
    
    return { type: "FORBIDDEN_TOOLS", value: [], description: c };
  });
}

export function isTextAllowed(constraints: Constraint[]): boolean {
  const forbiddenTools = getForbiddenTools(constraints);
  return !forbiddenTools.includes("text");
}

export function isShapesAllowed(constraints: Constraint[]): boolean {
  const forbiddenTools = getForbiddenTools(constraints);
  return !forbiddenTools.includes("shapes");
}

export function isImagesAllowed(constraints: Constraint[]): boolean {
  const forbiddenTools = getForbiddenTools(constraints);
  return !forbiddenTools.includes("images");
}

export function isShapeAllowed(constraints: Constraint[], shapeType: string): boolean {
  const forbiddenShapes = getForbiddenShapes(constraints);
  return !forbiddenShapes.includes(shapeType);
}

export function getForbiddenShapes(constraints: Constraint[]): string[] {
  const shapeConstraint = constraints.find((c) => c.type === "FORBIDDEN_SHAPES");
  if (shapeConstraint && Array.isArray(shapeConstraint.value)) {
    return shapeConstraint.value;
  }
  return [];
}

function getForbiddenTools(constraints: Constraint[]): string[] {
  const toolConstraint = constraints.find((c) => c.type === "FORBIDDEN_TOOLS");
  if (toolConstraint && Array.isArray(toolConstraint.value)) {
    return toolConstraint.value;
  }
  return [];
}

function getMaxShapes(constraints: Constraint[]): number | null {
  const constraint = constraints.find((c) => c.type === "MAX_SHAPES");
  return constraint && typeof constraint.value === "number" ? constraint.value : null;
}

function getMinShapes(constraints: Constraint[]): number | null {
  const constraint = constraints.find((c) => c.type === "MIN_SHAPES");
  return constraint && typeof constraint.value === "number" ? constraint.value : null;
}

function getMaxColors(constraints: Constraint[]): number | null {
  const constraint = constraints.find((c) => c.type === "MAX_COLORS");
  return constraint && typeof constraint.value === "number" ? constraint.value : null;
}

function getMinColors(constraints: Constraint[]): number | null {
  const constraint = constraints.find((c) => c.type === "MIN_COLORS");
  return constraint && typeof constraint.value === "number" ? constraint.value : null;
}

function getForbiddenContent(constraints: Constraint[]): string[] {
  const constraint = constraints.find((c) => c.type === "FORBIDDEN_CONTENT");
  if (constraint && Array.isArray(constraint.value)) {
    return constraint.value;
  }
  return [];
}

function getMinFontSize(constraints: Constraint[]): number | null {
  const constraint = constraints.find((c) => c.type === "MIN_FONT_SIZE");
  return constraint && typeof constraint.value === "number" ? constraint.value : null;
}

function getMaxFontSize(constraints: Constraint[]): number | null {
  const constraint = constraints.find((c) => c.type === "MAX_FONT_SIZE");
  return constraint && typeof constraint.value === "number" ? constraint.value : null;
}

function getUniqueColors(objects: any[]): Set<string> {
  const colorSet = new Set<string>();
  objects.forEach((obj) => {
    const fill = obj.fill;
    if (typeof fill === "string" && fill !== "transparent") {
      colorSet.add(fill);
    }
    const stroke = obj.stroke;
    if (typeof stroke === "string" && stroke !== "transparent") {
      colorSet.add(stroke);
    }
  });
  return colorSet;
}

function countShapes(objects: any[]): number {
  return objects.filter((o) => SHAPE_TYPES.includes(o.type)).length;
}

function hasTextObjects(objects: any[]): boolean {
  return objects.some((o) => (o.type || "").includes("text"));
}

function hasImageObjects(objects: any[]): boolean {
  return objects.some((o) => (o.type || "").includes("image"));
}

function getTextObjects(objects: any[]): any[] {
  return objects.filter((o) => (o.type || "").includes("text"));
}

export function checkViolations(
  canvas: any,
  constraints: Constraint[]
): string[] {
  if (!canvas) return [];
  
  const found: string[] = [];
  const objects = canvas.getObjects();
  
  const forbiddenTools = getForbiddenTools(constraints);
  const forbiddenContent = getForbiddenContent(constraints);
  const maxShapes = getMaxShapes(constraints);
  const minShapes = getMinShapes(constraints);
  const maxColors = getMaxColors(constraints);
  const minColors = getMinColors(constraints);
  const minFontSize = getMinFontSize(constraints);
  const maxFontSize = getMaxFontSize(constraints);
  
  if (forbiddenTools.includes("text") && hasTextObjects(objects)) {
    const constraint = constraints.find((c) => c.type === "FORBIDDEN_TOOLS");
    found.push(constraint?.description || "Text is not allowed in this challenge");
  }
  
  if (forbiddenTools.includes("shapes") && countShapes(objects) > 0) {
    const constraint = constraints.find((c) => c.type === "FORBIDDEN_TOOLS");
    found.push(constraint?.description || "Shapes are not allowed in this challenge");
  }
  
  if (forbiddenTools.includes("images") && hasImageObjects(objects)) {
    const constraint = constraints.find((c) => c.type === "FORBIDDEN_TOOLS");
    found.push(constraint?.description || "Images are not allowed in this challenge");
  }
  
  if (forbiddenContent.includes("images") && hasImageObjects(objects)) {
    found.push("External images are not allowed");
  }
  
  if (maxShapes !== null) {
    const shapeCount = countShapes(objects);
    if (shapeCount > maxShapes) {
      found.push(`Maximum ${maxShapes} shapes allowed (you have ${shapeCount})`);
    }
  }

  if (minShapes !== null) {
    const shapeCount = countShapes(objects);
    if (shapeCount < minShapes) {
      found.push(`Minimum ${minShapes} shapes required (you have ${shapeCount})`);
    }
  }

  if (maxColors !== null || minColors !== null) {
    const uniqueColors = getUniqueColors(objects);
    if (maxColors !== null && uniqueColors.size > maxColors) {
      found.push(`Maximum ${maxColors} colors allowed (you use ${uniqueColors.size})`);
    }
    if (minColors !== null && uniqueColors.size < minColors) {
      found.push(`Minimum ${minColors} colors required (you use ${uniqueColors.size})`);
    }
  }
  
  if (minFontSize !== null || maxFontSize !== null) {
    const textObjects = getTextObjects(objects);
    textObjects.forEach((obj) => {
      const fontSize = obj.fontSize || 16;
      if (minFontSize !== null && fontSize < minFontSize) {
        found.push(`Font size must be at least ${minFontSize}px (current: ${fontSize}px)`);
      }
      if (maxFontSize !== null && fontSize > maxFontSize) {
        found.push(`Font size must be at most ${maxFontSize}px (current: ${fontSize}px)`);
      }
    });
  }
  
  return found;
}

export function getConstraintSummary(constraints: Constraint[]): string[] {
  return constraints.map((c) => {
    if (c.description) return c.description;
    
    switch (c.type) {
      case "FORBIDDEN_TOOLS":
        return `No ${(c.value as string[]).join(", ")} allowed`;
      case "FORBIDDEN_SHAPES":
        return `No ${(c.value as string[]).join(", ")} shapes allowed`;
      case "MAX_SHAPES":
        return `Max ${c.value} shapes`;
      case "MIN_SHAPES":
        return `Min ${c.value} shapes`;
      case "MAX_COLORS":
        return `Max ${c.value} colors`;
      case "MIN_COLORS":
        return `Min ${c.value} colors`;
      case "FORBIDDEN_CONTENT":
        return `No ${(c.value as string[]).join(", ")}`;
      case "MIN_FONT_SIZE":
        return `Min font size: ${c.value}px`;
      case "MAX_FONT_SIZE":
        return `Max font size: ${c.value}px`;
      case "REQUIRED_COLORS":
        return `Required colors: ${(c.value as string[]).join(", ")}`;
      default:
        return "Unknown constraint";
    }
  });
}
