import { Box, Flex } from "@chakra-ui/react";

interface SectionTitleProps {
  text: string;
  isActive?: boolean;
  size?: "sm";
  children?: React.ReactNode;
}

function SectionTitle({ text, size = "sm", isActive = true, children }: SectionTitleProps) {
  return (
    <Flex
      fontWeight={500}
      fontSize={size === "sm" ? "12px" : "14px"}
      color={!isActive ? "var(--gray-500)" : "var(--gray-800)"}
      justify="space-between"
    >
      <Box>{text}</Box>
      <Box>{children}</Box>
    </Flex>
  );
}

export default SectionTitle;
