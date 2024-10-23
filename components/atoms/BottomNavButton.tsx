import { Box, Button } from "@chakra-ui/react";
import { iPhoneNotchSize } from "../../utils/validationUtils";
import Slide from "../layouts/PageSlide";

interface BottomNavButtonProps {
  text: string;
  func: () => void;
  color: "mint" | "black";
}

function BottomNavButton({ text, func, color }: BottomNavButtonProps) {
  return (
    <Slide isFixed={true} posZero="top">
      <Box
        borderTop="var(--border)"
        px={5}
        w="full"
        pt={2}
        pb={`calc(8px + ${iPhoneNotchSize()}px)`}
        mx="auto"
        maxW="var(--max-width)"
      >
        <Button size="lg" w="full" onClick={func} colorScheme={color}>
          {text}
        </Button>
      </Box>
    </Slide>
  );
}

export default BottomNavButton;
