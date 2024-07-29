import { Box } from "@chakra-ui/react";

type PollItemProps = {
  isChecked: boolean;
  onChange: () => void;
  value: string;
};

function PollItem(props: PollItemProps) {
  return (
    <Box
      as="li"
      display="flex"
      flexDirection="row"
      alignItems="center"
      gridColumnGap={2}
      w="100%"
      bg={props.isChecked ? "green.50" : "gray.50"}
      border="1px solid"
      borderColor={props.isChecked ? "green.400" : "gray.200"}
      rounded="lg"
      px={4}
      py={2}
      cursor="pointer"
      onClick={() => props.onChange()}
    >
      <p color="gray.700">{props.value}</p>
    </Box>
  );
}

export default PollItem;
