export interface IImageProps {
  url: string;
  priority?: boolean;
}

export type ColorType = "mint" | "red" | "gray" | "green" | "purple";

export type Size = "xl" | "lg" | "md" | "sm" | "xs";

export interface IColorType {
  colorType: ColorType;
}

export interface ISize {
  size: Size;
}


