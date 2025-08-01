import { Box, Flex } from "@chakra-ui/react";

interface SectionHeaderProps {
  title: string;
  subTitle: string;
  children?: React.ReactNode;
  size?: "sm" | "md";
}

function SectionHeader({ title, subTitle, size = "md", children }: SectionHeaderProps) {
  return (
    <Box>
      <Box fontSize="12px" mb={1} color="var(--gray-400)" lineHeight="16px">
        {subTitle}
      </Box>
      <Flex align="center">
        <Box
          mr="auto"
          color="var(--gray-800)"
          fontSize={size === "md" ? "18px" : "15px"}
          lineHeight={size === "md" ? "28px" : "inherit"}
          fontWeight={600}
        >
          {title}
        </Box>
        {children}
      </Flex>
    </Box>
  );
}

export default SectionHeader;
