import {
  Accordion as ChakraAccordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/react";
import styled from "styled-components";

import { OPEN_KAKAO_LINK } from "../../constants/contentsText/Private";
import ExternalLink from "./ExternalLink";

export interface IAccordionContent {
  title: string;
  content: string | string[];
}

interface IAccordion {
  contentArr: IAccordionContent[];
  isFull?: boolean;
  isQ?: boolean;
}

function Accordion({ contentArr, isFull, isQ = true }: IAccordion) {
  return (
    <ChakraAccordion allowToggle fontSize="13px">
      {contentArr?.map((item, idx) => {
        const content = item.content;
        return (
          <AccordionItem key={idx}>
            <AccordionButton
              _focus={{ outline: "none" }}
              p="var(--gap-3) var(--gap-2)"
              display="flex"
              justifyContent="space-between"
              fontSize="13px"
            >
              <Container isFull={isFull}>
                {isQ && <QIcon>Q.</QIcon>}
                <Title>{item.title}</Title>
              </Container>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel p="var(--gap-3) var(--gap-2)">
              <Content isFull={isFull}>
                {Array.isArray(content) ? (
                  content.map((list, idx) => <li key={idx}>{list}</li>)
                ) : (
                  <p>
                    {content}
                    {content === "" && (
                      <ExternalLink href={OPEN_KAKAO_LINK}>{OPEN_KAKAO_LINK}</ExternalLink>
                    )}
                  </p>
                )}
              </Content>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </ChakraAccordion>
  );
}

const Container = styled.div<{ isFull: boolean }>`
  margin: ${(props) => (props.isFull ? "0 var(--gap-2)" : 0)};
  display: flex;
  width: 100%;
  color: var(--gray-800);
`;

const QIcon = styled.span`
  margin-right: var(--gap-2);
`;

const Title = styled.div`
  width: 90%;
  text-align: start;
  font-weight: 600;
`;

const Content = styled.div<{ isFull: boolean }>`
  padding: ${(props) => props.isFull && "var(--gap-2)"};
`;

export default Accordion;
