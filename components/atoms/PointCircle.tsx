import { Box, Flex } from "@chakra-ui/react";

import { CustomColor } from "../../types/globals/interaction";

interface PointCircleProps {
  color?: CustomColor;
  colorText?: string;
}

function PointCircle({ color = "mint", colorText }: PointCircleProps) {
  return (
    <Flex w="16px" h="16px" justify="center" align="center">
      <Box w="4px" h="4px" borderRadius="50%" bgColor={colorText || `var(--color-${color})`} />
    </Flex>
  );
}

export default PointCircle;
