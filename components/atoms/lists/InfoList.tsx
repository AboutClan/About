import { ListItem, UnorderedList } from "@chakra-ui/react";

interface InfoListProps {
  items: string[];
  isLight?: boolean;
}

function InfoList({ items, isLight }: InfoListProps) {
  return (
    <UnorderedList
      mx={0}
      my={0}
      px={3}
      pl={2.5}
      py={4}
      bg="gray.100"
      border="1px solid var(--gray-200)"
      borderRadius="8px"
      fontSize="12px"
      lineHeight="20px"
      fontWeight="light"
      whiteSpace="nowrap"
      color={isLight ? "gray.600" : "gray.800"}
    >
      {items.map((item, idx) => (
        <ListItem key={idx} textAlign="start">
          {item}
        </ListItem>
      ))}
    </UnorderedList>
  );
}

export default InfoList;
