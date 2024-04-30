import styled from "styled-components";

export interface IShadowCircleProps {
  text: string;
  color: string;
  shadow: string;
}

interface IShadowCircleButton {
  buttonProps: IShadowCircleProps;
  onClick: () => void;
}

export default function ShadowCircleButton({ buttonProps, onClick }: IShadowCircleButton) {
  return (
    <OuterCircle shadow={buttonProps.shadow} onClick={onClick}>
      <InnerButton color={buttonProps.color}>{buttonProps.text}</InnerButton>
    </OuterCircle>
  );
}

const OuterCircle = styled.div<{ shadow: string }>`
  position: relative;
  z-index: 10;
  padding: 8px;
  border-radius: 50%;
  background-color: ${({ shadow }) => shadow || "transparent"};
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Styled component for the inner button
const InnerButton = styled.button`
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background-color: ${({ color }) => color || "transparent"};
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;
