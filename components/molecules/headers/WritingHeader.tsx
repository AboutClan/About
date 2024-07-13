import { Box, Button, Flex } from "@chakra-ui/react";
import Slide from "../../layouts/PageSlide";

interface WritingHeaderProps {}

function WritingHeader({}: WritingHeaderProps) {
  return (
    <Slide isFixed>
      <Flex justify="space-between" fontSize="20px" align="center" height="var(--header-h)">
        <Flex align="center">
          <Button px="16px" variant="ghost">
            <i className="fa-solid fa-x" />
          </Button>
          <Box fontWeight={800}>제목</Box>
        </Flex>
        <Button variant="ghost" fontSize="14px" px="16px">
          완료
        </Button>
      </Flex>
    </Slide>
  );
}

export default WritingHeader;
