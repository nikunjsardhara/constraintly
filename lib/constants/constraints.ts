export type ConstraintType =
  | "FORBIDDEN_TOOLS"
  | "FORBIDDEN_SHAPES"
  | "MAX_SHAPES"
  | "MIN_SHAPES"
  | "MAX_COLORS"
  | "MIN_COLORS"
  | "FORBIDDEN_CONTENT"
  | "MIN_FONT_SIZE"
  | "MAX_FONT_SIZE"
  | "REQUIRED_COLORS";

export interface Constraint {
  type: ConstraintType;
  value: ConstraintValue;
  description?: string;
}

export type ConstraintValue =
  | string[]
  | number
  | string
  | null;

export interface ConstraintDefinition {
  type: ConstraintType;
  label: string;
  description: string;
  defaultValue: ConstraintValue;
}

export const CONSTRAINT_DEFINITIONS: Record<ConstraintType, ConstraintDefinition> = {
  FORBIDDEN_TOOLS: {
    type: "FORBIDDEN_TOOLS",
    label: "Forbidden Tools",
    description: "Restrict certain tools from being used",
    defaultValue: [],
  },
  FORBIDDEN_SHAPES: {
    type: "FORBIDDEN_SHAPES",
    label: "Forbidden Shapes",
    description: "Restrict certain shape types from being used",
    defaultValue: [],
  },
  MAX_SHAPES: {
    type: "MAX_SHAPES",
    label: "Maximum Shapes",
    description: "Limit the number of shapes allowed",
    defaultValue: 10,
  },
  MIN_SHAPES: {
    type: "MIN_SHAPES",
    label: "Minimum Shapes",
    description: "Require minimum number of shapes",
    defaultValue: 1,
  },
  MAX_COLORS: {
    type: "MAX_COLORS",
    label: "Maximum Colors",
    description: "Limit the number of unique colors",
    defaultValue: 5,
  },
  MIN_COLORS: {
    type: "MIN_COLORS",
    label: "Minimum Colors",
    description: "Require minimum number of unique colors",
    defaultValue: 1,
  },
  FORBIDDEN_CONTENT: {
    type: "FORBIDDEN_CONTENT",
    label: "Forbidden Content",
    description: "Restrict certain content types",
    defaultValue: [],
  },
  MIN_FONT_SIZE: {
    type: "MIN_FONT_SIZE",
    label: "Minimum Font Size",
    description: "Set minimum font size for text",
    defaultValue: 8,
  },
  MAX_FONT_SIZE: {
    type: "MAX_FONT_SIZE",
    label: "Maximum Font Size",
    description: "Set maximum font size for text",
    defaultValue: 200,
  },
  REQUIRED_COLORS: {
    type: "REQUIRED_COLORS",
    label: "Required Colors",
    description: "Force using specific colors",
    defaultValue: [],
  },
};

export const FORBIDDEN_TOOL_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "shapes", label: "Shapes" },
  { value: "images", label: "Images" },
];

export const FORBIDDEN_CONTENT_OPTIONS = [
  { value: "gradients", label: "Gradients" },
  { value: "images", label: "External Images" },
  { value: "textures", label: "Textures" },
];

export function validateConstraint(constraint: Constraint): boolean {
  switch (constraint.type) {
    case "FORBIDDEN_TOOLS":
    case "FORBIDDEN_SHAPES":
    case "FORBIDDEN_CONTENT":
    case "REQUIRED_COLORS":
      return Array.isArray(constraint.value);
    case "MAX_SHAPES":
    case "MIN_SHAPES":
    case "MAX_COLORS":
    case "MIN_COLORS":
    case "MIN_FONT_SIZE":
    case "MAX_FONT_SIZE":
      return typeof constraint.value === "number" && constraint.value > 0;
    default:
      return false;
  }
}

export function createConstraint(
  type: ConstraintType,
  value: ConstraintValue,
  description?: string
): Constraint {
  return {
    type,
    value,
    description: description || CONSTRAINT_DEFINITIONS[type].description,
  };
}
