import { Button, Flex } from "@chakra-ui/react";

interface TwoButtonRowProps {
  left: {
    text: string;
    handleButton: () => void;
  };
  right: {
    text: string;
    handleButton: () => void;
  };
}

function TwoButtonRow({ left, right }: TwoButtonRowProps) {
  return (
    <Flex py={2} w="full" mt="auto">
      <Button colorScheme="black" size="lg" mr={3} flex={1} onClick={left.handleButton}>
        {left.text}
      </Button>
      <Button onClick={right.handleButton} size="lg" flex={1} colorScheme="mint">
        {right.text}
      </Button>
    </Flex>
  );
}

export default TwoButtonRow;
