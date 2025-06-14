import { Button, Flex } from "@chakra-ui/react";

interface ITwoButtonNav {
  leftText?: string;
  rightText: string;
  isLoading?: boolean;
  onClickLeft: () => void;
  onClickRight: () => void;
  size?: "md" | "lg";
  isDisabled?: boolean;
  colorType?: "mint" | "red";
}

function TwoButtonNav({
  leftText = "닫기",
  rightText,
  isLoading,
  onClickLeft,
  onClickRight,
  isDisabled = false,
  colorType = "mint",
}: ITwoButtonNav) {
  return (
    <Flex w="full">
      <Button
        color={colorType}
        w="full"
        h="40px"
        border="1px solid var(--color-mint)"
        borderRadius="8px"
        borderColor={colorType}
        onClick={onClickLeft}
        fontSize="12px"
        fontWeight="bold"
        mr={2}
        bg="white"
      >
        {leftText}
      </Button>
      <Button
        colorScheme={colorType}
        w="full"
        fontSize="12px"
        fontWeight="bold"
        h="40px"
        onClick={onClickRight}
        borderRadius="8px"
        isLoading={isLoading}
        isDisabled={isDisabled}
      >
        {rightText}
      </Button>
    </Flex>
  );
}

export default TwoButtonNav;
