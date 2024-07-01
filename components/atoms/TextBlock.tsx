import { Box, ListItem, OrderedList } from "@chakra-ui/react";

interface TextBlockProps {
  listContents: string[];
}

function TextBlock({ listContents }: TextBlockProps) {
  return (
    <Box p="8px 12px" bgColor="white" borderRadius="8px">
      <OrderedList fontSize="14px" lineHeight={2}>
        {listContents.map((content, idx) => (
          <ListItem key={idx}>{content}</ListItem>
        ))}
      </OrderedList>
    </Box>
  );
}

export default TextBlock;
