import { faChevronLeft, faChevronRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

// Styled button component
const StyledButton = styled.button`
  display: flex;
  align-items: center;
  font-weight: inherit;
`;

// Styled div for the icon container to conditionally apply margin
const IconContainer = styled.div`
  margin-right: ${({ dir }) => (dir === "left" ? "4px" : "0")};
  margin-left: ${({ dir }) => (dir === "right" ? "4px" : "0")};
`;

export interface IArrowTextButton {
  dir: "right" | "left";
  text: string;
  onClick?: () => void;
  size: "md" | "sm";
}

function ArrowTextButton({ dir, text, onClick, size }: IArrowTextButton) {
  return (
    <StyledButton onClick={onClick}>
      {dir === "left" && (
        <IconContainer dir={dir}>
          <FontAwesomeIcon icon={faChevronLeft} size={size === "sm" ? "sm" : undefined} />
        </IconContainer>
      )}
      {text}
      {dir === "right" && (
        <IconContainer dir={dir}>
          <FontAwesomeIcon icon={faChevronRight} size={size === "sm" ? "sm" : undefined} />
        </IconContainer>
      )}
    </StyledButton>
  );
}

export default ArrowTextButton;
