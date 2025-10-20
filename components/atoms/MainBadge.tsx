import { Badge } from "@chakra-ui/react";

interface MainBadgeProps {
  text: string;
  type?: "main" | "sub";
}

function MainBadge({ text, type = "main" }: MainBadgeProps) {
  return (
    <Badge
      px={2}
      py={1}
      bg={type === "main" ? "rgba(0, 194, 179, 0.1)" : "rgba(117,117, 117, 0.08)"}
      fontSize="10px"
      color={type === "main" ? "mint" : "gray.600"}
      fontWeight={400}
      borderRadius="4px"
    >
      {text}
    </Badge>
  );
}

export default MainBadge;
