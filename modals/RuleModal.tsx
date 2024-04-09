import styled from "styled-components";
import { ModalSubtitle } from "../styles/layout/modal";

import { IModal } from "../types/hooks/reactTypes";

import { IFooterOptions, ModalLayout } from "./Modals";


export interface IContentBasic {
  title: string;
  text?: string;
  texts?: string[];
}
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

  const footerOptions: IFooterOptions = {
    main: {},
    isFull: false,
  };

  return (
    <ModalLayout
      title={header.title}
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
      <ModalSubtitle isLight={true}>{header.text}</ModalSubtitle>
      {main.map((item, idx) => (
        <ContentItem title={item.title} texts={item.texts} key={idx} />
      ))}
    </ModalLayout>
  );
}

const Item = styled.div``;

const ItemContent = styled.ul`
  font-size: 12px;
  margin-left: var(--gap-4);
  margin-top: var(--gap-1);
  margin-bottom: var(--gap-3);
`;

const RuleTitle = styled.span`
  color: var(--gray-1);
  font-size: 13px;
  font-weight: 600;
`;

export default RuleModal;
