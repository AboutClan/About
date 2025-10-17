import { Spinner as ChakraSpinner } from "@chakra-ui/react";
import styled from "styled-components";

interface ISpinner {
  text?: string;
  size?: "sm" | "md";
}

export default function Spinner({ text, size = "md" }: ISpinner) {
  return (
    <>
      <Layout>
        <ChakraSpinner
          thickness={size === "md" ? "4px" : "2px"}
          speed={size === "md" ? "0.65s" : "0.55s"}
          emptyColor="gray.200"
          color="var(--color-mint)"
          size={size === "md" ? "lg" : "md"}
        />
        {text && <Message>위치를 확인중입니다...</Message>}
      </Layout>
    </>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100000;
`;

const Message = styled.div`
  margin-top: var(--gap-5);
  font-size: 20px;
  color: white;
`;
