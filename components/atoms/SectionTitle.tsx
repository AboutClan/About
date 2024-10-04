import { Box } from "@chakra-ui/react";

interface SectionTitleProps {
  text: string;
  isActive?: boolean;
  size?: "sm";
}

function SectionTitle({ text, size = "sm", isActive = true }: SectionTitleProps) {
  return (
    <Box
      fontWeight={500}
      fontSize={size === "sm" ? "12px" : "14px"}
      color={!isActive ? "var(--gray-500)" : "var(--gray-800)"}
    >
      {text}
    </Box>
  );
}

export default SectionTitle;
