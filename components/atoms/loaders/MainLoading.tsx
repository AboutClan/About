import styled from "styled-components";

import Spinner from "../Spinner";

export function MainLoading() {
  return (
    <MainLoadingLayout>
      <Spinner />
    </MainLoadingLayout>
  );
}

const MainLoadingLayout = styled.div<{ top?: number }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export function MainLoadingAbsolute() {
  return (
    <MainLoadingAbsoluteLayout>
      <Spinner />
    </MainLoadingAbsoluteLayout>
  );
}

const MainLoadingAbsoluteLayout = styled.div`
  background-color: blue;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
