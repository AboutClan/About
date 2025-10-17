import { Box, Flex } from "@chakra-ui/react";

import { CustomColor } from "../../types/globals/interaction";
import PointCircle from "./PointCircle";

export interface ColorLabelProps {
  color?: CustomColor;
  colorText?: string;
  //이후 colorText를 color로 변경
  text: string;
  size?: "sm" | "md";
}

function ColorLabel({ text, color, colorText, size = "sm" }: ColorLabelProps) {
  return (
    <Flex h="24px" align="center">
      <PointCircle color={!colorText ? color : null} colorText={colorText} />
      <Box
        fontSize={size === "sm" ? "10px" : "12px"}
        as="span"
        color={colorText || `var(--color-${color})`}
      >
        {text}
      </Box>
    </Flex>
  );
}

export default ColorLabel;
