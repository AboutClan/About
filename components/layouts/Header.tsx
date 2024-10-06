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
}

export default function Header({
  isBack = true,
  title,
  isSlide = true,
  url,
  rightPadding,
  func,
  children,
  isCenter,
  isBorder = true,
}: IHeader) {
  function HeaderLayout() {
    return (
      <HeaderContainer
        isBack={isBack}
        isCenter={isCenter}
        isBorder={isBorder}
        rightPadding={rightPadding}
      >
        <Flex>
          {isBack && <ArrowBackButton url={url} func={func} />}
          {!isCenter && (
            <Box ml={isBack && 2} fontWeight={700}>
              {title}
            </Box>
          )}
        </Flex>
        {isCenter && <CenterTitle>{title}</CenterTitle>}
        {isCenter && <Box w={5} />}
        <div>{children}</div>
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
}>`
  background-color: white;
  height: var(--header-h);
  font-size: 16px;
  padding-right: ${(props) => props.rightPadding || 20}px;
  padding-left: ${(props) => (props.isBack ? "16px" : "20px")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${(props) => (props.isBorder ? "var(--border)" : "none")};
  max-width: var(--max-width);
  margin: 0 auto;
`;

const CenterTitle = styled.div`
  flex: 1;
  font-weight: 700; /* font-extrabold */
  color: var(--gray-800); /* text-gray-1 - 색상은 예시입니다 */
  text-align: center;
`;
