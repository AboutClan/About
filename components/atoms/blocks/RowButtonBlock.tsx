import Link, { LinkProps } from "next/link";
import styled from "styled-components";

interface RowButtonBlockProps {
  text: string;
  url?: string;
  func?: () => void;
}

function RowButtonBlock({ text, url, func }: RowButtonBlockProps) {
  return (
    <>{url ? <CustomLink href={url}>{text}</CustomLink> : <Button onClick={func}>{text}</Button>}</>
  );
}

const Button = styled.button`
  width: 100%;
  padding: var(--gap-4) var(--gap-4);
  text-align: start;
  border-bottom: var(--border);
`;

const CustomLink = styled(Link)<LinkProps>`
  display: block;
  padding: var(--gap-4) var(--gap-4);
  text-align: start;
  border-bottom: var(--border);
`;

export default RowButtonBlock;
