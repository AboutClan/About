import { Box, Button, Flex, Grid, ListItem, UnorderedList } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import InfoBoxCol, { InfoBoxProps } from "../../components/molecules/InfoBoxCol";
import { DAILY_CHECK_WIN_LIST } from "../../constants/serviceConstants/dailyCheckConstatns";
import { IModal } from "../../types/components/modalTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

function StudyChallengeModal({ setIsModal }: IModal) {
  const today = dayjs().day() === 0 ? dayjs().add(1, "day") : dayjs();
  const [isDetailModal, setIsDetailModal] = useState(false);
  const footerOptions: IFooterOptions = {
    main: {
      text: "출 석",
      func: () => {},
    },
    isFull: true,
  };
  const infoBoxPropsArr: InfoBoxProps[] = [
    {
      category: "소모 금액",
      text: "-1000원",
    },
    {
      category: "환급 금액",
      text: "1000원 + 30 POINT",
    },
  ];

  return (
    <>
      <ModalLayout
        title={`${dayjsToFormat(today, "M월 셋째주 스터디 챌린지 신청")}`}
        footerOptions={footerOptions}
        setIsModal={setIsModal}
      >
        <Box mb={3}>
          일주일 <b>공부 목표 시간</b>을 정하고, 도전해 보세요!
        </Box>
        <Flex>
          <Flex pr={2} direction="column" borderRight="var(--border)">
            <Box mb={1} color="mint" fontSize="12px">
              시간 선택
            </Box>
            <Button
              onClick={() => setIsDetailModal(true)}
              size="sm"
              borderRadius="20px"
              bgColor="var(--gray-100)"
              color="var(--gray-600)"
            >
              달성 환급률
            </Button>
          </Flex>
          <Grid
            ml={2}
            flex={1}
            templateColumns="repeat(2,1fr)"
            templateRows="repeat(4,1fr)"
            gap="8px"
          >
            <Button size="sm" colorScheme="mint">
              3시간
            </Button>
            <Button size="sm">4시간</Button>
            <Button size="sm">5시간</Button>
            <Button size="sm">6시간</Button>
            <Button size="sm">8시간</Button>
            <Button size="sm">10시간</Button>
            <Button size="sm">12시간</Button>
            <Button size="sm">미참여</Button>
          </Grid>
        </Flex>
        <Box mt={3} py={2} borderTop="var(--border)" borderBottom="var(--border)">
          <InfoBoxCol infoBoxPropsArr={infoBoxPropsArr} />
        </Box>
        <UnorderedList mt={3} fontSize="12px" color="gray.600" textAlign="start">
          <ListItem>누적 시간은 카페 공부 시간 기준으로 측정됩니다.</ListItem>
          <ListItem>실패하더라도 실패 정도에 따라 환급됩니다.</ListItem>
        </UnorderedList>
      </ModalLayout>{" "}
      {isDetailModal && (
        <ModalLayout
          title="출석체크 확률표"
          footerOptions={{ main: { text: "확 인" } }}
          setIsModal={setIsDetailModal}
        >
          <Flex w="100%">
            <Flex flex={1} direction="column" borderRight="var(--border)">
              <Box fontWeight={600} mb={1}>
                당첨 목록
              </Box>
              {DAILY_CHECK_WIN_LIST.map((item, idx) => (
                <span key={idx}>{item.item}</span>
              ))}
            </Flex>
            <Flex flex={1} direction="column">
              <Box fontWeight={600} mb={1}>
                당첨 확률
              </Box>
              {DAILY_CHECK_WIN_LIST.map((item, idx) => (
                <span key={idx}>{item.percent}%</span>
              ))}
            </Flex>
          </Flex>
        </ModalLayout>
      )}
    </>
  );
}

export default StudyChallengeModal;
