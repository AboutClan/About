import Link from "next/link";
import styled from "styled-components";
interface IShadowBlockButton {
  text: string;
  url?: string;
  func?: () => void;
}
export default function ShadowBlockButton({ text, url, func }: IShadowBlockButton) {
  return (
    <>
      {url ? (
        <Link href={url} onClick={func}>
          <ButtonComponent text={text} />
        </Link>
      ) : (
        <ButtonComponent text={text} />
      )}
    </>
  );
}

function ButtonComponent({ text }: { text: string }) {
  return <Button>{text}</Button>;
}

const Button = styled.button`
  width: 100%;
  background-color: white;
  color: var(--color-mint);
  font-size: 16px;
  border: var(--border-mint-light);
  font-weight: 600;
  height: 54px;
  border-radius: 8px;
  :hover {
    background-color: var(--gray-200);
  }
`;
