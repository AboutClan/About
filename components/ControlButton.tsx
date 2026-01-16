import { Box, Button, Flex, ThemeTypings } from "@chakra-ui/react";
import { ReactElement } from "react";

interface ControlButtonProps {
  colorScheme?: ThemeTypings["colorSchemes"];
  rightIcon: ReactElement;
  handleClick: () => void;
  isDisabled?: boolean;
  text: string;
  hasBottomNav?: boolean;
}

function ControlButton({
  colorScheme = "mint",
  rightIcon,
  handleClick,
  text,
  isDisabled = false,
  hasBottomNav = false,
}: ControlButtonProps) {
  return (
    <Flex
      position="fixed"
      zIndex="50"
      fontSize="12px"
      lineHeight="24px"
      fontWeight="bold"
      bottom={`calc(${
        hasBottomNav ? "var(--bottom-nav-height)" : "8px"
      } + env(safe-area-inset-bottom, 0px) + 12px)`}
      right="20px"
    >
      <Button
        fontSize="12px"
        h="40px"
        color="white"
        px={4}
        borderRadius="20px"
        lineHeight="24px"
        iconSpacing={1}
        colorScheme={colorScheme}
        rightIcon={<Box mb="1px">{rightIcon}</Box>}
        onClick={handleClick}
        isDisabled={isDisabled}
        _hover={{
          background: undefined,
        }}
      >
        {text}
      </Button>
    </Flex>
  );
}

export default ControlButton;
