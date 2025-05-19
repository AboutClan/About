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
  isBorder = true,
  isTransparent,
  func,
  rightPadding,
}: IHeader) {
  console.log(rightPadding);
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
  background-color: ${(props) => (props.isTransparent ? "transparent" : "white")};
  height: var(--header-h);
  font-size: 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${(props) => (props.isBorder ? "var(--border)" : "none")};
  max-width: var(--max-width);
  margin: 0 auto;
`;
