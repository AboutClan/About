import { Box, Button } from "@chakra-ui/react";

import { getSafeAreaBottom } from "../../utils/validationUtils";
import Slide from "../layouts/PageSlide";

interface BottomNavButtonProps {
  text: string;
  func: () => void;
  color: "mint" | "black";
  isLoading: boolean;
}

function BottomNavButton({ text, func, color, isLoading }: BottomNavButtonProps) {
  return (
    <Slide isFixed={true} posZero="top">
      <Box px={5} w="full" pt={2} pb={getSafeAreaBottom(8)} mx="auto" maxW="var(--max-width)">
        <Button size="lg" w="full" onClick={func} isLoading={isLoading} colorScheme={color}>
          {text}
        </Button>
      </Box>
    </Slide>
  );
}

export default BottomNavButton;
