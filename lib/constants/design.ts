export const FORMAT_SIZES: Record<string, { width: number; height: number }> = {
  instagram: { width: 1080, height: 1080 },
  logo: { width: 800, height: 800 },
  youtube_thumbnail: { width: 1280, height: 720 },
  youtube_banner: { width: 2560, height: 1440 },
  facebook_banner: { width: 820, height: 312 },
  linkedin_banner: { width: 1584, height: 396 },
  twitter_post: { width: 1200, height: 675 },
  presentation: { width: 1920, height: 1080 },
};

export const FONTS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Verdana",
  "Courier New",
  "Comic Sans MS",
  "Impact",
  "Trebuchet MS",
  "Palatino Linotype",
] as const;

export const SHAPE_TYPES = ["rect", "circle", "ellipse", "triangle", "polygon", "line"] as const;

export type ShapeType = typeof SHAPE_TYPES[number];

export const SHAPE_DEFINITIONS: Record<ShapeType, { label: string; fabricType: string }> = {
  rect: { label: "Rectangle", fabricType: "rect" },
  circle: { label: "Circle", fabricType: "circle" },
  ellipse: { label: "Ellipse", fabricType: "ellipse" },
  triangle: { label: "Triangle", fabricType: "triangle" },
  polygon: { label: "Polygon", fabricType: "polygon" },
  line: { label: "Line", fabricType: "line" },
};

export const FORBIDDEN_SHAPE_OPTIONS = [
  { value: "rect", label: "Rectangle" },
  { value: "circle", label: "Circle" },
  { value: "ellipse", label: "Ellipse" },
  { value: "triangle", label: "Triangle" },
  { value: "polygon", label: "Polygon" },
  { value: "line", label: "Line" },
];

export const DEFAULT_COLORS = {
  fill: "#FF5722",
  stroke: "#000000",
} as const;

export const AUTO_SAVE_INTERVAL = 30000;
