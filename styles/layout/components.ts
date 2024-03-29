import styled from "styled-components";
export const SingleLineText = styled.div<{ lineNum?: number }>`
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => props.lineNum || 1};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
