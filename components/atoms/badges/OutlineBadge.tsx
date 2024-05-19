import { Badge, Box } from "@chakra-ui/react";

import { ITextAndColorSchemes } from "../../../types/components/propTypes";

interface IOutlineBadge extends ITextAndColorSchemes {
  size?: "md" | "sm";
}

export default function OutlineBadge({ text, color, size = "md" }: IOutlineBadge) {
  return (
    <>
      {color !== "redTheme" ? (
        <Box
          textAlign="center"
          borderRadius="4px"
          p="0 6px"
          h="24px"
          border={`1px solid ${color}`}
          color={color}
        >
          {text}
        </Box>
      ) : (
        <Badge
          p={size === "md" ? "3px 6px" : "2px 4px"}
          h="max-content"
          fontSize={size === "md" ? "12px" : "11px"}
          variant="outline"
          colorScheme={color}
        >
          {text}
        </Badge>
      )}
    </>
  );
}
