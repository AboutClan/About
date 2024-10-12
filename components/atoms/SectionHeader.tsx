import { Box, Button, Flex } from "@chakra-ui/react";
import { RightShortArrowIcon } from "../Icons/ArrowIcons";

interface SectionHeaderProps {
  title: string;
  subTitle: string;
  children?: React.ReactNode;
}

function SectionHeader({ title, subTitle, children }: SectionHeaderProps) {
  return (
    <Box>
      <Box fontSize="12px" mb={1} color="var(--gray-400)">
        {subTitle}
      </Box>
      <Flex align="center">
        <Box mr="auto" color="var(--gray-800)" fontSize="18px" fontWeight={600}>
          {title}
        </Box>
        {children || (
          <Button variant="unstyled" w="12px" height="12px" color="var(--color-mint)">
            <RightShortArrowIcon />
          </Button>
        )}
      </Flex>
    </Box>
  );
}

export default SectionHeader;
