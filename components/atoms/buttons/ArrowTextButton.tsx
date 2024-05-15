import { Box } from "@chakra-ui/react";
import styled from "styled-components";

import LeftArrowIcon from "../../../assets/icons/arrows/LeftArrowIcon";
import RightArrowIcon from "../../../assets/icons/arrows/RightArrowIcon";

type Size = "sm" | "md";
export interface IArrowTextButton {
  dir: "right" | "left";
  text: string;
  onClick?: () => void;
  size: "md" | "sm";
}

function ArrowTextButton({ dir, text, onClick, size }: IArrowTextButton) {
  return (
    <StyledButton onClick={onClick} size={size}>
      {dir === "left" && (
        <Box px="3.5px" h="14px">
          <LeftArrowIcon />
        </Box>
      )}
      {text}
      {dir === "right" && (
        <Box px="3.5px" h="14px">
          <RightArrowIcon />
        </Box>
      )}
    </StyledButton>
  );
}

const StyledButton = styled.button<{ size: Size }>`
  display: flex;
  align-items: center;
  font-weight: inherit;
  font-weight: 500;
  font-size: ${(props) => (props.size === "md" ? "16px" : "14px")};
  color: var(--gray-600);
`;

export default ArrowTextButton;
