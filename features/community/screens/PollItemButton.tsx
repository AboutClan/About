import { Box } from "@chakra-ui/react";

type PollItemProps = {
  isChecked: boolean;
  isDisabled: boolean;
  onClick: () => void;
  name: string;
  count: number;
};

function PollItemButton({ isChecked, isDisabled, onClick, name, count }: PollItemProps) {
  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      w="100%"
      bg={isChecked ? "green.50" : "white"}
      border="1px solid"
      borderColor={isChecked ? "green.400" : "gray.200"}
      disabled={isDisabled}
      _disabled={{
        cursor: "not-allowed",
      }}
      rounded="lg"
      px={4}
      py={2}
      cursor="pointer"
      onClick={onClick}
      color="gray.600"
    >
      <span>{name}</span>
      <Box as="span" color="gray.800" fontWeight={600} fontSize="12px">
        {count}
      </Box>
    </Box>
  );
}

export default PollItemButton;
