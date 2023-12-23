import styled from "styled-components";
import { ModalSubtitle } from "../../styles/layout/modal";

import { IContentBasic } from "../../types/common";
import { IModal } from "../../types/reactTypes";
import {
  ModalBody,
  ModalFooterOne,
  ModalHeaderCenter,
  ModalLayout,
} from "./Modals";

export interface IRuleModalContent {
  headerContent: IContentBasic;
  mainContent: IContentBasic[];
}

interface IRuleModal extends IModal {
  content: IRuleModalContent;
}

function RuleModal({ setIsModal, content }: IRuleModal) {
  if (!content) return null;
  const header = content.headerContent;
  const main = content.mainContent;

  const ContentItem = ({ title, texts }: IContentBasic) => (
    <Item>
      <RuleTitle>{title}</RuleTitle>
      <ItemContent>
        {texts.map((text, idx) => (
          <li key={idx}>{text}</li>
        ))}
      </ItemContent>
    </Item>
  );

  return (
    <ModalLayout onClose={() => setIsModal(false)} size="xxl">
      <ModalHeaderCenter text={header.title} />
      <ModalBody>
        <ModalSubtitle isLight={true}>{header.text}</ModalSubtitle>
        {main.map((item, idx) => (
          <ContentItem title={item.title} texts={item.texts} key={idx} />
        ))}
      </ModalBody>
      <ModalFooterOne onClick={() => setIsModal(false)} />
    </ModalLayout>
  );
}

const Item = styled.div``;

const ItemContent = styled.ul`
  font-size: 12px;
  margin-left: var(--margin-main);
  margin-top: var(--margin-min);
  margin-bottom: var(--margin-sub);
  line-height: var(--line-height);
`;

const RuleTitle = styled.span`
  color: var(--font-h1);
  font-size: 13px;
  font-weight: 600;
`;

export default RuleModal;
