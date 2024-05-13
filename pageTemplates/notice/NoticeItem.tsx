import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";

import { NoticeIcon } from "../../components/atoms/Icons/NoticeIcons";
import { NOTICE_ALERT } from "../../constants/keys/localStorage";
import { NOTICE_ARR } from "../../storage/notice";

function NoticeItem() {
  useEffect(() => {
    localStorage.setItem(NOTICE_ALERT, NOTICE_ARR.length + "");
  }, []);

  return (
    <>
      <Accordion allowToggle>
        {[...NOTICE_ARR].reverse().map((item) => (
          <AccordionItem borderTop="none" key={item.id} borderBottom="1px solid var(--gray-200)">
            <AccordionButton _focus={{ outline: "none" }} p="var(--gap-3) var(--gap-5)">
              <Box as="span" flex="1" textAlign="left" display="flex">
                <Flex width="48px" align="center">
                  <NoticeIcon type={item.category} />
                </Flex>
                <Flex direction="column" flex="1" ml="var(--gap-3)">
                  <Text fontSize="16px" fontWeight="500" color="var(--gray-900)">
                    {item.title}
                  </Text>
                  <Text fontSize="13px" color="var(--gray-700)">
                    {item.date}
                  </Text>
                </Flex>
              </Box>
              <AccordionIcon fontSize="24px" color="var(--gray-800)" />
            </AccordionButton>
            <AccordionPanel
              mt="var(--gap-3)"
              p="0 var(--gap-5)"
              pb="var(--gap-3)"
              color="var(--gray-800)"
              lineHeight="22px"
            >
              {item.content}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

export default NoticeItem;
