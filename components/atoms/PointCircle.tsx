import { Box, Flex } from "@chakra-ui/react";

import { CustomColor } from "../../types/globals/interaction";

interface PointCircleProps {
  color?: CustomColor;
}

function PointCircle({ color = "mint" }: PointCircleProps) {
  return (
    <Flex w="16px" h="16px" justify="center" align="center">
      <Box w="4px" h="4px" borderRadius="50%" bgColor={`var(--color-${color})`} />
    </Flex>
  );
}

export default PointCircle;
