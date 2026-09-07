import { Button, Flex, Image, Text, VStack } from "@chakra-ui/react";

export function TimeOptionCard({
  title,
  time,
  iconSrc,
  isSelected,
  onClick,
}: {
  title: string;
  time: string;
  iconSrc: string;
  isSelected?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      variant="unstyled"
      h="auto"
      borderRadius="20px"
      border="1px solid"
      borderColor={isSelected ? "mint" : "var(--gray-200)"}
      bg={isSelected ? "var(--color-mint-light)" : "white"}
      py={4}
      _hover={{ bg: isSelected ? "var(--color-mint-light)" : "#FAFAFA" }}
      _active={{ transform: "scale(0.99)" }}
      flex={1}
    >
      <VStack spacing="8px" w="full">
        <Text fontSize="17px" lineHeight="1" color="gray.800">
          {title}
        </Text>
        <Flex align="center" justify="center" w="72px" h="72px">
          <Image
            src={iconSrc}
            alt={title}
            boxSize="72px"
            objectFit="contain"
            draggable={false}
            userSelect="none"
          />
        </Flex>
        <Text fontSize="14px" fontWeight="700" color={isSelected ? "mint" : "gray.600"}>
          {time}
        </Text>
      </VStack>
    </Button>
  );
}
