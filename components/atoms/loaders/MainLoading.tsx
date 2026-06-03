import styled from "styled-components";

import Spinner from "../Spinner";

export function MainLoading({
  size = "md",
  top = "50%",
}: {
  size?: "sm" | "md";
  top?: string;
}) {
  return (
    <MainLoadingLayout $top={top}>
      <Spinner size={size} />
    </MainLoadingLayout>
  );
}

const MainLoadingLayout = styled.div<{ $top: string }>`
  position: fixed;
  top: ${({ $top }) => $top};
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
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
