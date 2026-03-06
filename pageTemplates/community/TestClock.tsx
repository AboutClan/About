import { Button, Flex, Image, Text, VStack } from "@chakra-ui/react";

type TimePreset = "lunch" | "dinner" | null;

interface TimeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPreset: TimePreset;
  onSelectPreset: (preset: Exclude<TimePreset, null>) => void;
  onManualSelect: () => void;
  onSubmit: () => void;
}

const CARD_BORDER = "1px solid";
const CARD_BORDER_COLOR = "#E7ECEF";
const ACTIVE_BG = "#EEF8F8";
const PRIMARY = "#12C7C1";
const TEXT_MAIN = "#2F3437";
const TEXT_SUB = "#8B9298";

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
      border={CARD_BORDER}
      borderColor={isSelected ? "#BFEDEC" : CARD_BORDER_COLOR}
      bg={isSelected ? ACTIVE_BG : "white"}
      py={4}
      _hover={{ bg: isSelected ? ACTIVE_BG : "#FAFAFA" }}
      _active={{ transform: "scale(0.99)" }}
      flex={1}
    >
      <VStack spacing="8px" w="full">
        <Text fontSize="17px" lineHeight="1" color={TEXT_MAIN}>
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
