import { Box, Flex } from "@chakra-ui/react";

export interface ValueBoxColItemProps {
  left: string;
  right: string;
  isFinal?: boolean;
  color?: "red";
}

interface ValueBoxColProps {
  items: ValueBoxColItemProps[];
}

function ValueBoxCol({ items }: ValueBoxColProps) {
  return (
    <Flex
      direction="column"
      bg="rgba(0,194,179,0.02)"
      borderRadius="16px"
      border="1px solid rgba(0,194,179,0.1)"
      px={5}
      py={4}
      fontSize="12px"
      fontWeight="light"
    >
      <Box>
        {items.map((item, idx) => (
          <Flex
            key={idx}
            py={1}
            pt={item?.isFinal ? 2 : 1}
            pb={item?.isFinal ? 0 : 1}
            justify="space-between"
            lineHeight="16px"
            borderTop={item?.isFinal ? "1px solid var(--gray-200)" : "none"}
          >
            <Box color="gray.900" fontWeight={item?.isFinal ? "bold" : "regular"}>
              {item.left}
            </Box>
            <Box
              fontWeight={item?.isFinal ? "semibold" : "regular"}
              color={item?.color === "red" ? "red" : item?.isFinal ? "mint" : "gray.600"}
            >
              {item.right}
            </Box>
          </Flex>
        ))}
      </Box>
    </Flex>
  );
}

export default ValueBoxCol;
