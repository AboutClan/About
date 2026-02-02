import { Box, Button } from "@chakra-ui/react";

import { getSafeAreaBottom } from "../../utils/validationUtils";
import Slide from "../layouts/PageSlide";

interface BottomFixedButton {
  text: string;
  func: () => void;
  color?: "mint" | "black" | "red";
}

function BottomFixedButton({ text, func, color = "mint" }: BottomFixedButton) {
  return (
    <Slide isFixed posZero="top">
      <Box w="full" position="fixed" py={2} px={5} bottom={getSafeAreaBottom(0)}>
        <Button
          size="lg"
          w="100%"
          maxW="var(--view-max-width)"
          borderRadius="12px"
          onClick={func}
          colorScheme={func ? color : "blackAlpha"}
        >
          {text}
        </Button>
      </Box>
    </Slide>
  );
}

export default BottomFixedButton;
