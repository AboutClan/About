import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { getSafeAreaBottom } from "../../utils/validationUtils";
import Slide from "../layouts/PageSlide";

interface WritingNavigationProps extends React.PropsWithChildren {}

function WritingNavigation({ children }: WritingNavigationProps) {
  const [keyboardBottomPx, setKeyboardBottomPx] = useState("0px");

  useEffect(() => {
    const update = () => {
      const viewportHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
      const windowHeight = window.innerHeight;
      const keyboardHeight = Math.max(0, windowHeight - viewportHeight);

      setKeyboardBottomPx(`${keyboardHeight}px`);
    };

    // 초기 계산
    update();

    // iOS Safari 대응: resize + scroll(visualViewport), geometrychange 일부 브라우저
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, []);

  // bottom: max(keyboardHeight, safe-area) — 키보드가 없으면 safe-area만 적용
  const bottomStyle = `max(${keyboardBottomPx}, ${getSafeAreaBottom(0)})`;

  return (
    <Slide isFixed={true}>
      <Flex
        mx="auto"
        maxW="var(--max-width)"
        position="fixed"
        bottom={bottomStyle}
        left={0}
        right={0}
        bgColor="white"
        borderTop="var(--border-main)"
        // 내부 padding에 safe-area를 더해 여백 확보
        py={3}
        px={3}
        // Chakra prop으로 전달이 안 되면 sx로도 가능
        sx={{
          paddingBottom: getSafeAreaBottom(12),
        }}
      >
        {children}
      </Flex>
    </Slide>
  );
}

export default WritingNavigation;
