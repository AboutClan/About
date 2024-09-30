import { Button, Flex } from "@chakra-ui/react";
import { JSXElementConstructor, ReactElement } from "react";
import styled from "styled-components";

export interface ButtonOptionsProps {
  text: string;
  func: () => void;
  icon?: ReactElement<any, string | JSXElementConstructor<any>>;
  color?: string;
}

export interface IButtonGroups {
  buttonOptionsArr: ButtonOptionsProps[];
  currentValue: string;
  size?: "sm" | "md";
  isWrap?: boolean;
  isEllipse?: boolean;
  type?: "block" | "text";
}

export default function ButtonGroups({
  buttonOptionsArr,
  currentValue,
  size,
  isWrap = false,
  isEllipse = false,
  type = "block",
}: IButtonGroups) {
  return (
    <Layout isWrap={isWrap}>
      {buttonOptionsArr.map((buttonOptions, idx) => (
        <Flex flexShrink={0} key={idx} onClick={buttonOptions.func}>
          {type === "block" ? (
            <Button
              mr="8px"
              colorScheme={buttonOptions.text === currentValue ? "mintTheme" : undefined}
              variant={buttonOptions.text === currentValue ? undefined : "outline"}
              bg={buttonOptions.text === currentValue ? undefined : "white"}
              size={size}
              rounded={isEllipse ? "2xl" : "md"}
              leftIcon={buttonOptions?.icon}
              _focus={{
                outline: "none",
                boxShadow: "none",
              }}
            >
              {buttonOptions.text}
            </Button>
          ) : (
            <Button
              mr="8px"
              color={buttonOptions.color}
              fontWeight={buttonOptions.text === currentValue ? 600 : 400}
              variant="ghost"
              leftIcon={buttonOptions?.icon}
              size="xs"
              _focus={{
                outline: "none",
                boxShadow: "none",
              }}
            >
              {buttonOptions.text}
            </Button>
          )}
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
