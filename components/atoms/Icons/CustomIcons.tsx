import { Box } from "@chakra-ui/react";

import EveryTimeIcon from "./everyTimeIcon";

export default function EveryTimeLogo() {
  return (
    <Box fontSize="36px" fontWeight={800} lineHeight={1.3}>
      <Box position="relative" width="max-content">
        <Box
          position="relative"
          as="span"
          rounded="lg"
          bgColor="var(--gray-8)"
          zIndex={3}
          color="#C62917"
        >
          에브리타임
        </Box>
        <Box position="absolute" zIndex={0} top={-7} right={-5}>
          <EveryTimeIcon isSmall={false} />
        </Box>
        <br />
        <Box color="var(--gray-1)">홍보 이벤트</Box>
      </Box>
    </Box>
  );
}
