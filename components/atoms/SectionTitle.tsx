import { Box } from "@chakra-ui/react";

interface SectionTitleProps {
  text: string;
  darkness: "main" | "sub";
  size?: "sm";
}

function SectionTitle({ text, size = "sm", darkness }: SectionTitleProps) {
  return (
    <Box
      fontWeight={500}
      fontSize={size === "sm" ? "12px" : "14px"}
      color={darkness === "sub" ? "var(--gray-500)" : "var(--gray-800)"}
    >
      {text}
    </Box>
  );
}

export default SectionTitle;
