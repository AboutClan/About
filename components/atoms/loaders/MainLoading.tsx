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

interface MainLoadingAbsoluteProps {
  size?: "sm" | "md";
}

export function MainLoadingAbsolute({ size = "md" }: MainLoadingAbsoluteProps) {
  return (
    <MainLoadingAbsoluteLayout>
      <Spinner size={size} />
    </MainLoadingAbsoluteLayout>
  );
}

const MainLoadingAbsoluteLayout = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
