import { Flex } from "@chakra-ui/react";

import { useKeypadHeight } from "../../hooks/custom/useKeypadHeight";

interface WritingNavigationProps extends React.PropsWithChildren {}

function WritingNavigation({ children }: WritingNavigationProps) {
  const keypadHeight = useKeypadHeight();

  return (
    <Flex
      mx="auto"
      maxW="var(--max-width)"
      position="fixed"
      bottom={`${keypadHeight}px`}
      left={0}
      right={0}
      bgColor="white"
      borderTop="var(--border-main)"
      justifyContent="space-between"
      p="8px"
    >
      {children}
    </Flex>
  );
}

export default WritingNavigation;
