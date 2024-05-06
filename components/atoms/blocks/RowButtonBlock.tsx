import Link from "next/link";
import styled from "styled-components";

interface RowButtonBlockProps {
  text: string;
  url?: string;
  func?: () => void;
}

function RowButtonBlock({ text, url, func }: RowButtonBlockProps) {
  return <Button onClick={func}>{url ? <Link href={url}>{text}</Link> : text}</Button>;
}

const Button = styled.button`
  width: 100%;
  padding: var(--gap-4) var(--gap-4);
  text-align: start;
  border-bottom: var(--border);
`;

export default RowButtonBlock;
