import { Box, Flex } from "@chakra-ui/react";

import { CustomColor } from "../../types/globals/interaction";
import PointCircle from "./PointCircle";

interface PointCircleTextProps {
  color?: CustomColor;
  text: string;
}

function PointCircleText({ text, color }: PointCircleTextProps) {
  return (
    <Flex h="24px" align="center">
      <PointCircle color={color} />
      <Box fontSize="11px" as="span" color={`var(--color-${color})`}>
        {text}
      </Box>
    </Flex>
  );
}

export default PointCircleText;
