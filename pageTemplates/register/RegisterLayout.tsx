import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import Slide from "../../components/layouts/PageSlide";

function RegisterLayout({
  children,
  errorMessage,
  isSlide = true,
}: {
  children: ReactNode;
  errorMessage?: string;
  isSlide?: boolean;
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
        <Box px={5}>
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
`;

const Message = styled.div`
  font-size: 11px;
  color: var(--color-red);
  padding: 6px;
  padding-left: 12px;
`;

export default RegisterLayout;
