import styled from "styled-components";

interface RowTextBlockButtonProps {
  text: string;
  onClick: () => void;
}

function RowTextBlockButton({ text, onClick }: RowTextBlockButtonProps) {
  return <Button onClick={onClick}>{text}</Button>;
}

const Button = styled.button`
  padding: 16px;
  text-align: start;
  border-bottom: var(--border);
`;

export default RowTextBlockButton;
