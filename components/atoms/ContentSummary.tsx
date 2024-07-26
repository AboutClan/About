import { useState } from "react";
import styled from "styled-components";

interface ContentSummaryProps {
  text: string;
}

function ContentSummary({ text }: ContentSummaryProps) {
  const [isShort, setIsShort] = useState(true);

  return (
    <P isShort={isShort} onClick={() => setIsShort((old) => !old)}>
      {text}
    </P>
  );
}

const P = styled.p<{ isShort: boolean }>`
  ${(props) =>
    props.isShort &&
    `-webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;   `}

  font-size: 13px;
  display: -webkit-box;

  > span {
    font-size: 12px;
  }
`;

export default ContentSummary;
