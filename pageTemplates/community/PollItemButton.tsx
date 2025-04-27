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
    >
      <span>{name}</span>
      <span>{count}</span>
    </Box>
  );
}

export default PollItemButton;
