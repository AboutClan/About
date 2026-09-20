import { Box, Flex, FlexProps } from "@chakra-ui/react";

/** 모든 bottom drawer의 상단 핸들 — 터치영역 포함해 디자인을 한 곳에서 고정한다.
 *  드래그가 동작하는 드로어는 onPointerDown/cursor를 props로 넘겨 붙인다. */
export default function DrawerHandle(props: FlexProps) {
  return (
    <Flex justify="center" py="12px" w="full" flexShrink={0} {...props}>
      <Box w="56px" h="4px" borderRadius="4px" bg="gray.300" opacity={0.6} />
    </Flex>
  );
}
