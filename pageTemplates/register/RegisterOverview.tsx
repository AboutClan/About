import React from "react";
import styled from "styled-components";

function RegisterOverview({
  children,
  isShort,
  isNoTop,
}: {
  children: React.ReactNode;
  isShort?: boolean;
  isNoTop?: boolean;
}) {
  return (
    <Layout isshort={isShort} isNoTop={isNoTop}>
      {children}
    </Layout>
  );
}

const Layout = styled.div<{ isshort: boolean; isNoTop: boolean }>`
  display: flex;

  flex-direction: column;
  line-height: 1.8;
  margin-top: ${(props) => (props?.isNoTop ? "8px" : "20px")};
  margin-bottom: ${(props) => (props.isshort || props?.isNoTop ? "20px" : "40px")};
  > span:last-child {
    font-weight: light;
    font-size: 13px;
    line-height: 20px;
    color: var(--gray-600);
  }
  > span:first-child {
    font-size: 24px;
    font-weight: bold;
    line-height: 36px;
    color: var(--gray-800);
    margin-bottom: ${(props) => (props.isshort ? "0" : "8px")};
  }
`;

export default RegisterOverview;
