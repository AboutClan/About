import styled from "styled-components";

import { ModalSubtitle } from "../styles/layout/modal";
import { IModal } from "../types/components/modalTypes";
import { IFooterOptions, IPaddingOptions, ModalLayout } from "./Modals";

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

  function ContentItem({ title, texts }: IContentBasic) {
    return (
      <Item>
        <RuleTitle>{title}</RuleTitle>
        <ItemContent>
          {texts.map((text, idx) => (
            <li key={idx}>{text}</li>
          ))}
        </ItemContent>
      </Item>
    );
  }

  const footerOptions: IFooterOptions = {
    main: {},
    isFull: false,
  };

  const paddingOptions: IPaddingOptions = {
    body: {
      bottom: 0,
    },
  };

  return (
    <ModalLayout
      title={header.title}
      footerOptions={footerOptions}
      setIsModal={setIsModal}
      paddingOptions={paddingOptions}
    >
      <ModalSubtitle>{header.text}</ModalSubtitle>
      {main.map((item, idx) => (
        <ContentItem title={item.title} texts={item.texts} key={idx} />
      ))}
    </ModalLayout>
  );
}

const Item = styled.div``;

const ItemContent = styled.ul`
  font-size: 13px;
  margin-left: var(--gap-4);
  margin-top: var(--gap-1);
  margin-bottom: var(--gap-3);
  line-height: 1.8;
`;

const RuleTitle = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

export default RuleModal;
