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
  isCenter?: boolean;
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
  rightPadding,
  children,
  isCenter = true,
  isBorder = true,
  isTransparent,
  func,
}: IHeader) {
  function HeaderLayout() {
    return (
      <HeaderContainer
        isBack={isBack}
        isCenter={isCenter}
        isBorder={!isTransparent && isBorder}
        rightPadding={rightPadding}
        isTransparent={isTransparent}
      >
        <Flex align="center" width="100%">
          {isBack && (
            <ArrowBackButton func={func} color={isTransparent ? "white" : "mint"} url={url} />
          )}
          {isCenter && (
            <Box
              fontWeight="bold"
              position="absolute"
              left="50%"
              transform="translateX(-50%)"
              fontSize="16px"
              textAlign="center"
            >
              {title}
            </Box>
          )}
          {!isCenter && (
            <Box ml={isBack && 1} fontWeight={700}>
              {title}
            </Box>
          )}
          <Flex ml="auto" align="center">
            {children}
          </Flex>
        </Flex>
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
  isCenter?: boolean;
  rightPadding: number;
  isTransparent: boolean;
}>`
  background-color: ${(props) => (props.isTransparent ? "transparent" : "white")};
  height: var(--header-h);
  font-size: 16px;
  padding-right: ${(props) => props.rightPadding || 20}px;
  padding-left: ${(props) => (props.isBack ? "4px" : "20px")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${(props) => (props.isBorder ? "var(--border)" : "none")};
  max-width: var(--max-width);
  margin: 0 auto;
`;
