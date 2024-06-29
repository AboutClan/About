import { Button } from "@chakra-ui/react";
import styled from "styled-components";

interface ITwoButtonNav {
  leftText?: string;
  rightText: string;
  isLoading?: boolean;
  onClickLeft: () => void;
  onClickRight: () => void;
  size?: "md" | "lg";
}

function TwoButtonNav({
  leftText = "닫기",
  rightText,
  isLoading,
  onClickLeft,
  onClickRight,
  size = "lg",
}: ITwoButtonNav) {
  console.log(53);
  return (
    <Layout size={size}>
      <Button
        bg="white"
        h="100%"
        border="1.2px solid var(--color-mint)"
        color="var(--color-mint)"
        fontSize="16px"
        onClick={onClickLeft}
      >
        {leftText}
      </Button>
      <Button
        onClick={onClickRight}
        bg="var(--color-mint)"
        h="100%"
        color="white"
        fontSize="16px"
        isLoading={isLoading}
        disabled={false}
      >
        {rightText}
      </Button>
    </Layout>
  );
}

const Layout = styled.div<{ size: "md" | "lg" }>`
  width: 100%;
  display: flex;
  height: ${(props) => (props.size === "lg" ? "46px" : "42px")};
  > button:first-child {
    margin-right: var(--gap-3);
  }
  > button {
    flex: 1;
  }
  > button:last-child {
    :hover {
      background-color: var(--color-mint);
    }
  }
`;

export default TwoButtonNav;
