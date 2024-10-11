import styled from "styled-components";

interface IIconButton {
  onClick?: () => void;
  children: React.ReactNode;
}
export default function IconButton({ children, onClick }: IIconButton) {
  return <Button onClick={onClick}>{children}</Button>;
}

const Button = styled.button`
  position: relative;
`;
