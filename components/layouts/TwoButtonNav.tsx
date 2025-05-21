import { Button, Flex } from "@chakra-ui/react";

interface ITwoButtonNav {
  leftText?: string;
  rightText: string;
  isLoading?: boolean;
  onClickLeft: () => void;
  onClickRight: () => void;
  size?: "md" | "lg";
  isDisabled?: boolean;
}

function TwoButtonNav({
  leftText = "닫기",
  rightText,
  isLoading,
  onClickLeft,
  onClickRight,
  isDisabled = false,
}: ITwoButtonNav) {
  return (
    <Flex w="full">
      <Button
        color="mint"
        w="full"
        h="40px"
        border="1px solid var(--color-mint)"
        borderRadius="8px"
        onClick={onClickLeft}
        fontSize="12px"
        fontWeight="bold"
        mr={2}
        bg="white"
      >
        {leftText}
      </Button>
      <Button
        colorScheme="mint"
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
