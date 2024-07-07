import { Button } from "@chakra-ui/react";
import Link from "next/link";
import styled from "styled-components";

interface IHighlightedTextButton {
  text: string;
  url?: string;
  onClick?: () => void;
}
export default function HighlightedTextButton({ text, url, onClick }: IHighlightedTextButton) {
  return (
    <>
      {url ? (
        <Link href={url}>
          <Button variant="ghost" size="xs">
            <Text> {text}</Text>
          </Button>
        </Link>
      ) : (
        <Button variant="ghost" size="xs" onClick={onClick}>
          <Text> {text}</Text>
        </Button>
      )}
    </>
  );
}

const Text = styled.span`
  background-color: var(--color-mint-light);
  font-size: 14px;
  color: var(--color-mint);
  font-weight: 400;
`;
