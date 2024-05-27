import { Badge } from "@chakra-ui/react";

import { ITextAndColorSchemes } from "../../../types/components/propTypes";

interface IOutlineBadge extends ITextAndColorSchemes {
  size?: "md" | "sm";
}

export default function OutlineBadge({ text, colorScheme, size = "md" }: IOutlineBadge) {

  return (
    <Badge
      p={size === "md" ? "3px 6px" : "2px 4px"}
      h="max-content"
      fontSize={size === "md" ? "12px" : "11px"}
      variant="outline"
      colorScheme={colorScheme}
    >
      {text}
    </Badge>
  );
}
