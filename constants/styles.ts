import { GatherStatus } from "../types/models/gatherTypes/gatherTypes";

export const TABLE_COLORS = [
  "#FF8896",
  "#FEBC5A",
  "#6AC2A3",
  "#71C3FF",
  "#9E7CFF",
  "#FFC1CC",
  "#A6ABBF",
  "#ADD8E6",
  "#D7BCE8",
  "#8ED081",
  "#B0C4DE",
  "#FF8896",
  "#FEBC5A",
  "#B5BDEB",
  "#9E7CFF",
  "#FFC1CC",
  "#A6ABBF",
  "#ADD8E6",
  "#D7BCE8",
  "#B0C4DE",
];

export const TABLE_STRONG_COLORS = ["#ff6b6b", "#FFA500", "#007BFF", "#20B2AA", "#BA55D3"];

export const TABLE_STRING_COLORS_BG = {
  "#ff6b6b": "rgba(255, 107, 107, 0.1)",
  "#FFA500": "rgba(255, 165, 0, 0.1)",
  "#007BFF": "rgba(0, 123, 255, 0.1)",
  "#20B2AA": "rgba(32, 178, 170, 0.1)",
  "#BA55D3": "rgba(186, 85, 211, 0.1)",
};

export const SCHEME_TO_COLOR = {
  facebook: "#223B67",
  badgePink: "#FF69B4",
  mintTheme: "#00c2b3",
};

export const ICON_SIZE = {
  xl: 80,
  lg: 60,
  md: 50,
  sm: 42,
  xs: 30,
};

export const STATUS_TP_COLOR: Record<GatherStatus, string> = {
  open: "var(--color-mint)",
  pending: "var(--color-red)",
  close: "var(--gray-500)",
  end: "var(--gray-500)",
};

export const COLOR_SCHEME_BG = {
  "var(--color-mint)": "rgba(0, 194, 179, 0.1)",
  "var(--color-red)": "rgba(255, 107, 107, 0.1)",
  [TABLE_COLORS[1]]: "rgba(254, 188, 90, 0.1)",
  [TABLE_COLORS[3]]: "rgba(113, 195, 255, 0.1)",
};
