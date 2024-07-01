import { Box, List, ListItem } from "@chakra-ui/react";

interface ICheckList {
  contents: string[];
}

export default function CheckList({ contents }: ICheckList) {
  return (
    <List spacing="12px">
      {contents.map((list, idx) => (
        <ListItem key={idx}>
          <Box as="span" mr="8px">
            <i className="fa-light fa-circle-check" style={{ color: "var(--color-mint)" }} />
          </Box>
          {list}
        </ListItem>
      ))}
    </List>
  );
}
