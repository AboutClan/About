import { ColorType } from "@/types/components/assetTypes";

type TextType = "text" | "border" | "bg";

export const getColorText = (colorType: ColorType, textTypes: TextType[]) => {
  let text = "";
  textTypes.forEach((type) => {
    text += type + "-" + colorType;
    if (colorType === "gray") {
      if (type === "text") text += "-500";
      if (type === "border") text += "-300";
      if (type === "bg") {
        text += "-100";
        text += " text-gray-1";
      }
    } else if (colorType !== "mint") text += "-400";
    text += " ";
  });

  return text;
};
