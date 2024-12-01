import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import ArrowBackButton from "../../components/atoms/buttons/ArrowBackButton";
import Slide from "./PageSlide";
interface IHeader {
  title: string;
  isBack?: boolean;
  func?: () => void;
  url?: string;
  isSlide?: boolean;
  rightPadding?: number;
  isCenter?: boolean;
  isBorder?: boolean;
  children?: React.ReactNode;
  defaultUrl?: string;
  isTransparent?: boolean;
}

export default function Header({
  isBack = true,
  title,
  isSlide = true,
  url,
  rightPadding,
  func,
  children,
  isCenter = true,
  isBorder = true,
  defaultUrl,
  isTransparent,
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
        <Flex align="center" position="relative" width="100%">
          {isBack && (
            <ArrowBackButton
              color={isTransparent ? "white" : "mint"}
              defaultUrl={defaultUrl}
              url={url}
              func={func}
            />
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
          <Box ml="auto">{children}</Box>
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

