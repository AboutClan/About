import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import Slide from "../../components/layouts/PageSlide";

function RegisterLayout({
  children,
  errorMessage,
}: {
  children: ReactNode;
  errorMessage?: string;
}) {
  const { handleSubmit } = useForm();

  const onValid = () => {};
  return (
    <Slide>
      <Layout onSubmit={handleSubmit(onValid)}>
        {children}
        <Message>{errorMessage}</Message>
      </Layout>
    </Slide>
  );
}

const Layout = styled.div`
  margin: 0 var(--gap-4);
  padding-bottom: 40px;
`;

const Message = styled.div`
  font-size: 11px;
  color: var(--color-red);
  padding: 6px;
  padding-left: 12px;
`;

export default RegisterLayout;
