import { Button, Flex } from "@chakra-ui/react";
import { JSXElementConstructor, ReactElement } from "react";
import styled from "styled-components";

export interface ButtonOptionsProps {
  text: string;
  func: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: ReactElement<any, string | JSXElementConstructor<any>>;
  color?: string;
}

export interface IButtonGroups {
  buttonOptionsArr: ButtonOptionsProps[];
  currentValue: string;
  size?: "sm" | "md" | "lg";
  isWrap?: boolean;
  isEllipse?: boolean;
  type?: "block" | "text";
  height?: number;
}

export default function ButtonGroups({
  buttonOptionsArr,
  currentValue,
  size,
  isWrap = false,
  isEllipse = false,
  height,
  type = "block",
}: IButtonGroups) {
  return (
    <Layout isWrap={isWrap}>
      {buttonOptionsArr.map((buttonOptions, idx) => (
        <Flex flexShrink={0} key={idx} onClick={buttonOptions.func}>
          {type === "block" ? (
            <Button
              mr={idx !== buttonOptionsArr.length - 1 ? "8px" : 0}
              variant={buttonOptions.text === currentValue ? undefined : "outline"}
              bgColor="white !important"
              color={buttonOptions.text === currentValue ? "mint" : "gray.600"}
              fontWeight={buttonOptions.text === currentValue ? "medium" : "regular"}
              size={size}
              h={size === "md" ? "32px" : undefined}
              px={size === "md" ? "12px" : size === "sm" ? "16px" : "undefined"}
              rounded={isEllipse ? "16px" : "md"}
              leftIcon={buttonOptions?.icon}
              fontSize="12px"
              border={"1px solid var(--gray-200)"}
              borderColor={
                buttonOptions.text === currentValue
                  ? "var(--color-mint) !important"
                  : "var(--gray-200)"
              }
              {...(height && { h: `${height}px` })}
            >
              {buttonOptions.text}
            </Button>
          ) : (
            <Button
              mr={idx !== buttonOptionsArr.length - 1 ? "8px" : 0}
              color={buttonOptions.color}
              fontWeight={buttonOptions.text === currentValue ? 600 : 400}
              variant="ghost"
              leftIcon={buttonOptions?.icon}
              fontSize="11px"
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
  flex-direction: row; /* 가로로 배치 */
  row-gap: ${(props) => (props.isWrap ? "8px" : 0)};
  flex-wrap: ${(props) => (props.isWrap ? "wrap" : "nowrap")};
  overflow-x: auto;
`;
