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
import dayjs from "dayjs";
import { useEffect } from "react";

import { NoticeIcon } from "../../components/Icons/NoticeIcons";
import ExternalLink from "../../components/molecules/ExternalLink";
import { NOTICE_ALERT } from "../../constants/keys/localStorage";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { NOTICE_ARR } from "../../storage/notice";
import { dayjsToStr } from "../../utils/dateTimeUtils";

function NoticeItem() {
  const { data: userInfo } = useUserInfoQuery();

  useEffect(() => {
    localStorage.setItem(NOTICE_ALERT, NOTICE_ARR.length + "");
  }, []);

  const list = [];

  if (userInfo) {
    const REGISTER_NOTICE = {
      id: "10000",
      title: "🎉 신규 가입을 환영합니다! 🎉",
      category: "main",
      content:
        "About 멤버가 되신 것을 환영합니다! 활동을 시작하시기 전에 [신규 인원 가이드]를 꼭 확인해 주세요!",
      date: dayjsToStr(dayjs(userInfo?.registerDate)),
      link: "https://pf.kakao.com/_SaWXn/109551233",
      linkTitle: "신규 인원 가이드",
    };

    NOTICE_ARR.forEach((notice) => {
      if (dayjs(notice.date).startOf("day").isAfter(dayjs(userInfo?.registerDate).startOf("day"))) {
        list.push(REGISTER_NOTICE);
        list.push(notice);
      } else {
        list.push(notice);
      }
    });
    if (NOTICE_ARR.length === list.length) {
      list.push(REGISTER_NOTICE);
    }
  }

  return (
    <>
      <Accordion allowToggle>
        {[...list]
          .slice()
          .reverse()
          .map((item) => (
            <AccordionItem borderTop="none" key={item.id} borderBottom="1px solid var(--gray-200)">
              <AccordionButton _focus={{ outline: "none" }} p="var(--gap-3) var(--gap-5)">
                <Box as="span" flex="1" textAlign="left" display="flex">
                  <Flex width="48px" align="center">
                    <NoticeIcon type={item.category} />
                  </Flex>
                  <Flex direction="column" flex="1" ml="var(--gap-3)">
                    <Text fontSize="16px" fontWeight="500" color="var(--gray-800)">
                      {item.title}
                    </Text>
                    <Text fontSize="13px" color="var(--gray-600)">
                      {item.date}
                    </Text>
                  </Flex>
                </Box>
                <AccordionIcon fontSize="24px" color="var(--gray-700)" />
              </AccordionButton>
              <AccordionPanel
                mt="var(--gap-3)"
                p="0 var(--gap-5)"
                pb="var(--gap-3)"
                color="var(--gray-700)"
                lineHeight="22px"
              >
                <p>{item.content}</p>
                {item?.link && (
                  <Box
                    my={3}
                    py={3}
                    px={5}
                    bg="rgba(0,194,179,0.02)"
                    borderRadius="12px"
                    border="1px solid rgba(0,194,179,0.08)"
                    as="p"
                    fontSize="13px"
                    lineHeight="20px "
                    color="gray.700"
                  >
                    <Box as="span" mr={2} color="mint">
                      [{item.linkTitle}]
                    </Box>
                    <br />
                    <ExternalLink href={item.link}>{item.link}</ExternalLink>
                  </Box>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </>
  );
}

export default NoticeItem;
