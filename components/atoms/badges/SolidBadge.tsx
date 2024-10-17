import { Badge } from "@chakra-ui/react";

export function SolidBadge({ text, colorScheme }) {
  return (
    <Badge
      px="8px"
      py="4px"
      h="fit-content"
      w="fit-content"
      borderRadius={4}
      fontSize="12px"
      variant="solid"
      colorScheme={colorScheme}
    >
      {text}
    </Badge>
  );
}
