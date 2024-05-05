import { Badge as ChakraBadge } from "@chakra-ui/react";
import { ThemeTypings } from "@chakra-ui/system";

interface IBadge {
  text: string;
  size?: "sm" | "md" | "lg";
  type?: "outline" | "solid";
  colorScheme: ThemeTypings["colorSchemes"];
}

export function Badge({ text, colorScheme, size = "sm", type = "solid" }: IBadge) {
  return (
    <ChakraBadge
      p="2px 4px"
      fontSize={size === "sm" ? "11px" : size === "md" ? "12px" : "13px"}
      colorScheme={colorScheme}
      variant={type}
    >
      {text}
    </ChakraBadge>
  );
}
