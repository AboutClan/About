import { Button, Flex } from "@chakra-ui/react";
import styled from "styled-components";

export interface IButtonOptions {
  text: string;
  func: () => void;
}

export interface IButtonGroups {
  buttonItems: IButtonOptions[];
  currentValue: string;
  size?: "sm" | "md";
  isWrap?: boolean;
  isEllipse?: boolean;
}

export default function ButtonGroups({
  buttonItems,
  currentValue,
  size,
  isWrap = false,
  isEllipse = false,
}: IButtonGroups) {
  return (
    <Layout isWrap={isWrap}>
      {buttonItems.map((buttonData, idx) => (
        <Flex flexShrink={0} key={idx} onClick={buttonData.func}>
          <Button
            mr="8px"
            colorScheme={buttonData.text === currentValue ? "mintTheme" : undefined}
            variant={buttonData.text === currentValue ? undefined : "outline"}
            bg={buttonData.text === currentValue ? undefined : "white"}
            size={size}
            rounded={isEllipse ? "2xl" : "md"}
          >
            {buttonData.text}
          </Button>
        </Flex>
      ))}
    </Layout>
  );
}

const Layout = styled.div<{ isWrap: boolean }>`
  ::-webkit-scrollbar {
    display: none;
  }
  display: flex;
  row-gap: ${(props) => (props.isWrap ? "8px" : 0)};
  flex-wrap: ${(props) => (props.isWrap ? "wrap" : "nowrap")};
  overflow-x: auto;
`;
