import {
  Accordion as ChakraAccordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import { OPEN_KAKAO_LINK } from "../../constants/contentsText/Private";
import { ShortArrowIcon } from "../Icons/ArrowIcons";
import ExternalLink from "./ExternalLink";

export interface IAccordionContent {
  title: string;
  content: string | string[];
}

interface IAccordion {
  contentArr: IAccordionContent[];
  isFull?: boolean;
  isQ?: boolean;
  defaultIndex?: number;
}

function Accordion({ contentArr, isFull, isQ = true, defaultIndex }: IAccordion) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(defaultIndex ?? null);
  const handleAccordionChange = (index: number | null) => {
    setSelectedIndex(index);
  };

  return (
    <ChakraAccordion
      allowToggle
      fontSize="13px"
      index={selectedIndex}
      onChange={(index) => handleAccordionChange(index as number | null)}
      sx={{
        "& .chakra-accordion__item": {
          borderBottomWidth: "0px",
        },
        "& .chakra-accordion__item:last-of-type": {
          borderBottomWidth: "0px",
        },
      }}
    >
      {contentArr?.map((item, idx) => {
        const content = item.content;
        return (
          <AccordionItem
            fontSize="14px"
            fontWeight="regular"
            lineHeight="20px"
            key={idx}
            borderTop="none"
            borderBottom={idx === contentArr.length - 1 ? null : "var(--border) !important"}
          >
            <AccordionButton
              _focus={{ outline: "none", bg: "none", boxShadow: "none" }}
              py={4}
              px={0}
              display="flex"
              justifyContent="space-between"
              fontSize="14px"
              borderTop="none"
            >
              <Container isFull={isFull}>
                {isQ && (
                  <Box mr={2} color="mint" fontWeight="extrabold">
                    Q.
                  </Box>
                )}
                <Box textAlign="start" fontWeight={idx === selectedIndex ? "bold" : "regular"}>
                  {item.title}
                </Box>
              </Container>
              {/* <AccordionIcon /> */}
              <Box opacity={idx === selectedIndex ? 1 : 0.2}>
                <ShortArrowIcon
                  dir={idx === selectedIndex ? "top" : "bottom"}
                  size="md"
                  color="gray"
                />
              </Box>
            </AccordionButton>
            <AccordionPanel
              py={3}
              px={5}
              bg="rgba(0,194,179,0.02)"
              borderRadius="12px"
              border="1px solid rgba(0,194,179,0.08)"
            >
              {Array.isArray(content) ? (
                content.map((list, idx) => <li key={idx}>{list}</li>)
              ) : (
                <Box as="p" fontSize="13px" lineHeight="20px " color="gray.700">
                  <Box as="span" mr={2} color="mint" fontWeight="extrabold">
                    A.
                  </Box>
                  <br />
                  {content}
                  {content === "" && (
                    <ExternalLink href={OPEN_KAKAO_LINK}>{OPEN_KAKAO_LINK}</ExternalLink>
                  )}
                </Box>
              )}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </ChakraAccordion>
  );
}

const Container = styled.div<{ isFull: boolean }>`
  display: flex;
  width: 100%;
  color: var(--gray-800);
`;

export default Accordion;
