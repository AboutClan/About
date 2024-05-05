import { faUserGroup } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

import HighlightedText, { IHighlightedText } from "../../../../atoms/HighlightedText";

interface IBoardHeaderText {
  headerText: IHighlightedText;
}
export default function BoardHeaderText({ headerText }: IBoardHeaderText) {
  return (
    <HeaderContainer>
      <Icon icon={faUserGroup} size="sm" />
      <HighlightedText text={headerText.text} hightlightedText={headerText.hightlightedText} />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  padding-bottom: 12px; /* pb-3 */
  display: flex;
  align-items: center;
  background-color: var(
    --gray-8
  ); /* bg-gray-8, assuming a typo in the original class and intending for a gray background */
`;

const Icon = styled(FontAwesomeIcon)`
  color: var(--gray-3); /* text-gray-3, assuming a specific gray color */
  margin-right: 4px; /* mr-1 */
`;
