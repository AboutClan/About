import { Box, Flex } from "@chakra-ui/react";

export interface ValueBoxCol2ItemProps {
  left: string;
  leftSub?: string;
  right: string;
  lineThroughText?: string;
  isFinal?: boolean;
}

interface ValueBoxCol2Props {
  items: ValueBoxCol2ItemProps[];
}

function ValueBoxCol2({ items }: ValueBoxCol2Props) {
  return (
    <Flex
      direction="column"
      bg="rgba(0,194,179,0.02)"
      borderRadius="16px"
      border="1px solid rgba(0,194,179,0.08)"
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
            fontWeight="semibold"
            borderTop={item?.isFinal ? "1px solid var(--gray-200)" : "none"}
          >
            <Flex>
              <Box color="gray.800" fontWeight={item?.isFinal ? "bold" : "regular"}>
                {item.left}
              </Box>
              <Box ml={1} color="gray.600" fontWeight="500">
                {item?.leftSub}
              </Box>
            </Flex>
            <Flex fontWeight="semibold" color={item?.isFinal ? "mint" : "gray.800"}>
              <Box textDecoration="line-through" mr={2} color="gray.600">
                {item?.lineThroughText}
              </Box>
              <Box fontWeight="semibold">{item.right}</Box>
            </Flex>
          </Flex>
        ))}
      </Box>
    </Flex>
  );
}

export default ValueBoxCol2;
