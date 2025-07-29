import { ListItem, UnorderedList } from "@chakra-ui/react";

interface InfoListProps {
  items: string[];
  isLight?: boolean;
  isSmall?: boolean;
}

function InfoList({ items, isLight, isSmall = false }: InfoListProps) {
  return (
    <UnorderedList
      mx={0}
      my={0}
      px={3}
      pl={isSmall ? 1.5 : 2.5}
      py={isSmall ? 2 : 4}
      bg="gray.100"
      border="1px solid var(--gray-200)"
      borderColor={isSmall ? "gray.100" : "gray.200"}
      borderRadius="8px"
      fontSize="12px"
      lineHeight={isSmall ? "24px" : "20px"}
      fontWeight="light"
      whiteSpace="nowrap"
      color={isLight ? "gray.600" : "gray.800"}
      w={isSmall ? "full" : "inherit"}
    >
      {items.map((item, idx) => (
        <ListItem
          key={idx}
          textAlign="start"
          color={
            item === "입금하지 않고 누르는 경우, 동아리에서 영구 제명됩니다." ? "red" : "inherit"
          }
        >
          {item}
        </ListItem>
      ))}
    </UnorderedList>
  );
}

export default InfoList;
