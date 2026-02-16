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

export const SHAPE_TYPES = ["rect", "circle", "ellipse", "triangle", "polygon", "path"] as const;

export const DEFAULT_COLORS = {
  fill: "#FF5722",
  stroke: "#000000",
} as const;

export const AUTO_SAVE_INTERVAL = 30000;
