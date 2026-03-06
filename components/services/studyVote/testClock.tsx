import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdDarkMode, MdLunchDining, MdSchedule } from "react-icons/md";

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

function TimeOptionCard({
  title,
  time,
  icon,
  isSelected,
  onClick,
}: {
  title: string;
  time: string;
  icon: React.ReactElement;
  isSelected?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      variant="unstyled"
      h="auto"
      w="full"
      minH="208px"
      borderRadius="20px"
      border={CARD_BORDER}
      borderColor={isSelected ? "#BFEDEC" : CARD_BORDER_COLOR}
      bg={isSelected ? ACTIVE_BG : "white"}
      p="24px"
      _hover={{ bg: isSelected ? ACTIVE_BG : "#FAFAFA" }}
      _active={{ transform: "scale(0.99)" }}
    >
      <VStack spacing="14px" w="full">
        <Text fontSize="32px" lineHeight="1" color={TEXT_MAIN}>
          {title}
        </Text>

        <Flex
          align="center"
          justify="center"
          w="72px"
          h="72px"
          borderRadius="full"
          bg={isSelected ? "#DDF4F3" : "#F7F9FA"}
        >
          <Box fontSize="42px" color={isSelected ? PRIMARY : "#5E6A71"}>
            {icon}
          </Box>
        </Flex>

        <Text fontSize="22px" fontWeight="700" color={isSelected ? PRIMARY : TEXT_SUB}>
          {time}
        </Text>
      </VStack>
    </Button>
  );
}

export default function TimeSelectModal({
  isOpen,
  onClose,
  selectedPreset,
  onSelectPreset,
  onManualSelect,
  onSubmit,
}: TimeSelectModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <ModalContent maxW="560px" borderRadius="28px" px="24px" pt="18px" pb="24px">
        <ModalBody p={0}>
          <VStack spacing="0" align="stretch">
            <Flex justify="center" mb="20px">
              <Box w="52px" h="6px" borderRadius="full" bg="#D9DEE2" />
            </Flex>

            <Text fontSize="32px" fontWeight="800" color={TEXT_MAIN} mb="8px" textAlign="left">
              예상 참여 시간을 선택해 주세요
            </Text>

            <Text fontSize="18px" color={TEXT_SUB} mb="24px">
              스터디 전까지 언제든 변경할 수 있습니다.
            </Text>

            <Box h="1px" bg="#EEF1F3" mb="24px" />

            <HStack spacing="16px" align="stretch">
              <TimeOptionCard
                title="점심"
                time="14:00 - 18:00"
                icon={<Icon as={MdLunchDining} />}
                isSelected={selectedPreset === "lunch"}
                onClick={() => onSelectPreset("lunch")}
              />

              <TimeOptionCard
                title="저녁"
                time="19:00 - 23:00"
                icon={<Icon as={MdDarkMode} />}
                isSelected={selectedPreset === "dinner"}
                onClick={() => onSelectPreset("dinner")}
              />
            </HStack>

            <Button
              mt="16px"
              h="56px"
              borderRadius="16px"
              variant="outline"
              borderColor={PRIMARY}
              color={PRIMARY}
              bg="white"
              fontSize="20px"
              fontWeight="700"
              leftIcon={<Icon as={MdSchedule} boxSize={5} />}
              onClick={onManualSelect}
              _hover={{ bg: "#F4FFFF" }}
              _active={{ bg: "#EFFFFE" }}
            >
              직접 시간 선택
            </Button>

            <Button
              mt="18px"
              h="64px"
              borderRadius="18px"
              bg={PRIMARY}
              color="white"
              fontSize="24px"
              fontWeight="800"
              onClick={onSubmit}
              _hover={{ bg: "#10B8B3" }}
              _active={{ bg: "#0EA9A4" }}
            >
              신청 완료
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
