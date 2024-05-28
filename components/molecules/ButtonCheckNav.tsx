import { Button, ButtonGroup } from "@chakra-ui/react";
import styled from "styled-components";

interface IButtonCheckNav {
  buttonList: string[];
  selectedButton: string;
  setSelectedButton: (value: string) => void;
  isLineBtn?: boolean;
  isWrap?: boolean;
}

function ButtonCheckNav({
  buttonList,
  selectedButton,
  setSelectedButton,
  isLineBtn,
  isWrap,
}: IButtonCheckNav) {
  const filtered = buttonList.filter(() => true);
  return (
    <Layout>
      <ButtonGroup flexWrap={isWrap ? "wrap" : null} gap={!isLineBtn ? "var(--gap-2)" : "0"}>
        {!isLineBtn
          ? filtered.map((item) => (
              <Button
                bgColor={item === selectedButton ? "var(--color-mint)" : "white"}
                color={item === selectedButton ? "white" : "var(--gray-600)"}
                key={item}
                onClick={() => setSelectedButton(item)}
                ml="0px !important"
                border="1px solid var(--gray-400)"
                _focus={{ outline: "none", bgColor: "var(--color-mint)" }}
              >
                {item}
              </Button>
            ))
          : filtered.map((item) => (
              <Button
                p="0 var(--gap-3)"
                variant="ghost"
                color={item === selectedButton ? "var(--gray-800)" : "var(--gray-600)"}
                key={item}
                onClick={() => setSelectedButton(item)}
                ml="0px !important"
                fontWeight={item === selectedButton ? 600 : 400}
                borderBottom={
                  item === selectedButton
                    ? "2px solid var(--gray-800)"
                    : "2px solid var(--gray-200)"
                }
                borderRadius="0"
                _focus={{ outline: "none", bgColor: "transparent" }}
              >
                {item}
              </Button>
            ))}
      </ButtonGroup>
    </Layout>
  );
}

const Layout = styled.div`
  overflow-x: auto;
  padding-bottom: var(--gap-3);

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default ButtonCheckNav;
