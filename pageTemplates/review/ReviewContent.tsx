import { useState } from "react";
import styled from "styled-components";

function ReviewContent({ text }: { text: string }) {
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

  padding: 0 var(--gap-4);
  font-size: 13px;
  display: -webkit-box;

  > span {
    font-size: 12px;
    color: var(--gray-2);
  }
`;

export default ReviewContent;
