import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import Slide from "../../components/layouts/PageSlide";

function RegisterLayout({
  children,
  errorMessage,
  isSlide = true,
  isNoPx = false,
}: {
  children: ReactNode;
  errorMessage?: string;
  isSlide?: boolean;
  isNoPx?: boolean;
}) {
  const { handleSubmit } = useForm();

  const onValid = () => {};
  return (
    <>
      {isSlide ? (
        <Slide>
          <Layout onSubmit={handleSubmit(onValid)}>
            {children}
            <Message>{errorMessage}</Message>
          </Layout>
        </Slide>
      ) : (
        <Box px={isNoPx ? 0 : 5}>
          <Layout onSubmit={handleSubmit(onValid)}>
            {children}
            <Message>{errorMessage}</Message>
          </Layout>
        </Box>
      )}
    </>
  );
}

const Layout = styled.div`
  padding-bottom: 40px;
  min-height: calc(100vh - 68px);
  background-color: pink;
`;

const Message = styled.div`
  font-size: 11px;
  color: var(--color-red);
  padding: 6px;
  padding-left: 12px;
`;

export default RegisterLayout;
