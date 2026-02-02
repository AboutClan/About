import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import ArrowBackButton from "../../components/atoms/buttons/ArrowBackButton";
import Slide from "./PageSlide";
interface IHeader {
  title: string;
  isBack?: boolean;
  url?: string;
  isSlide?: boolean;
  rightPadding?: number;
  isBorder?: boolean;
  children?: React.ReactNode;
  isTransparent?: boolean;
  func?: () => void;
}

export default function Header({
  isBack = true,
  title,
  isSlide = true,
  url,
  children,
  isBorder = false,
  isTransparent,
  func,
}: IHeader) {
  function HeaderLayout() {
    return (
      <HeaderContainer
        isBack={isBack}
        isBorder={!isTransparent && isBorder}
        isTransparent={isTransparent}
      >
        <Box w="130px" pl={1}>
          {isBack && (
            <ArrowBackButton func={func} color={isTransparent ? "white" : "mint"} url={url} />
          )}
        </Box>
        <Box
          flex={1}
          mx="auto"
          fontWeight="bold"
          fontSize="16px"
          textAlign="center"
          whiteSpace="nowrap"
        >
          {title}
        </Box>
        <Box w="130px">
          <Flex mr={4} justify="flex-end" align="center">
            {children}
          </Flex>
        </Box>
      </HeaderContainer>
    );
  }

  return (
    <>
      {isSlide ? (
        <Slide isFixed={true}>
          <HeaderLayout />
        </Slide>
      ) : (
        <HeaderLayout />
      )}
    </>
  );
}

const HeaderContainer = styled.header<{
  isBorder?: boolean;
  isBack?: boolean;
  isTransparent: boolean;
}>`
  width: full;

  background-color: ${(props) => (props.isTransparent ? "transparent" : "white")};
  /* ✅ safe-area 반영 */
  padding-top: env(safe-area-inset-top, 0px);

  /* ✅ 헤더 전체 높이 = 기존 헤더 높이 + safe-area */
  height: calc(var(--header-h) + env(safe-area-inset-top, 0px));
  font-size: 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${(props) => (props.isBorder ? "var(--border)" : "none")};
  max-width: var(--max-width);
  margin: 0 auto;
`;
