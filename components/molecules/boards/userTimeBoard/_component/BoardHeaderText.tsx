import { Box } from "@chakra-ui/react";
import styled from "styled-components";

import HighlightedText, { IHighlightedText } from "../../../../atoms/HighlightedText";

interface IBoardHeaderText {
  headerText: IHighlightedText;
}
export default function BoardHeaderText({ headerText }: IBoardHeaderText) {
  return (
    <HeaderContainer>
      <i className="fa-light fa-user-group fa-sm" style={{ color: "var(--gray-600)" }} />
      <Box w="4px" />
      <HighlightedText text={headerText.text} hightlightedText={headerText.hightlightedText} />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  padding-bottom: 12px; /* pb-3 */
  display: flex;
  align-items: center;
  background-color: var(
    --gray-100
  ); /* bg-gray-8, assuming a typo in the original class and intending for a gray background */
`;
