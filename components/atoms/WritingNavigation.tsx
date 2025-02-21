import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Slide from "../layouts/PageSlide";

interface WritingNavigationProps extends React.PropsWithChildren {}

function WritingNavigation({ children }: WritingNavigationProps) {
  const [modalBottom, setModalBottom] = useState("0px");

  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      const windowHeight = window.innerHeight;
      const keyboardHeight = windowHeight - viewportHeight;

      if (keyboardHeight > 0) {
        // 모바일 키보드가 올라왔을 때의 높이 기준 조정
        setModalBottom(`${keyboardHeight}px`); // 모달을 키보드 바로 위에 위치
      } else {
        setModalBottom("0px"); // 기본 위치
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Slide isFixed={true}>
      <Flex
        mx="auto"
        maxW="var(--max-width)"
        position="fixed"
        bottom={modalBottom}
        left={0}
        right={0}
        bgColor="white"
        borderTop="var(--border-main)"
        py={2}
        px={3}
      >
        {children}
      </Flex>
    </Slide>
  );
}

export default WritingNavigation;
