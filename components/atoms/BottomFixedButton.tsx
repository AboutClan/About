import { Box, Button } from "@chakra-ui/react";

import { iPhoneNotchSize } from "../../utils/validationUtils";

interface BottomFixedButton {
  text: string;
  func: () => void;
}

function BottomFixedButton({ text, func }: BottomFixedButton) {
  return (
    <Box w="full" position="fixed" py={2} px={5} bottom={`${iPhoneNotchSize()}px`}>
      <Button
        size="lg"
        w="100%"
        maxW="var(--view-max-width)"
        borderRadius="12px"
        onClick={func}
        colorScheme={func ? "mint" : "blackAlpha"}
      >
        {text}
      </Button>
    </Box>
  );
}

export default BottomFixedButton;
