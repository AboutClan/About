import { Box, Button, Flex, Grid, ListItem, UnorderedList } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import InfoBoxCol, { InfoBoxProps } from "../../components/molecules/InfoBoxCol";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { IModal } from "../../types/components/modalTypes";
import { dayjsToFormat, getWeekNumber } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

function StudyChallengeModal({ setIsModal }: IModal) {
  const toast = useToast();
  const { data: userInfo } = useUserInfoQuery();

  const today = dayjs().day() === 0 ? dayjs().add(1, "day") : dayjs();

  const [targetTime, setTargetTime] = useState<number>(3);

  const timeArr = [3, 4, 5, 6, 8, 10, 12, null];

  const { mutate, isLoading } = useUserInfoFieldMutation("weekStudyTargetHour", {
    onSuccess() {
      if (targetTime) {
        toast("success", "신청 완료! 이번주 공부 목표 달성을 응원합니다!");
      } else {
        toast("success", "다음번엔 참여해 주세요!");
      }
      setIsModal(false);
    },
  });

  const handleSubmit = () => {
    mutate({ hour: targetTime });
  };

  const infoBoxPropsArr: InfoBoxProps[] = [
    {
      category: "보유 금액",
      text: `${userInfo?.deposit}원`,
    },
    {
      category: "소모 금액",
      text: targetTime ? "-1000원" : "0원",
      color: "red",
    },
    {
      category: "환급 금액",
      text: targetTime ? `1000원 + ${targetTime * 10} POINT` : "0원",
      color: "mint",
    },
  ];

  const footerOptions: IFooterOptions = {
    main: {
      text: "신 청",
      func: handleSubmit,
      isLoading,
    },
    isFull: true,
  };

  return (
    <>
      <ModalLayout
        title={`${dayjsToFormat(today, `M월 ${getWeekNumber(dayjs().day() === 6 ? dayjs().add(1, "day") : dayjs())}주차 스터디 챌린지 신청`)}`}
        footerOptions={footerOptions}
        setIsModal={setIsModal}
        headerOptions={{}}
      >
        <Box mb={4}>
          이번주 <b>공부 목표 시간</b>을 정하고, 도전해 보세요!
          <br />
          달성률에 따라 <b>추가 포인트</b>를 획득할 수 있습니다.
        </Box>
        <Flex>
          <Flex direction="column" borderRight="var(--border)">
            <Flex
              h="28px"
              justify="center"
              align="center"
              mb={2}
              pl={2}
              pr={4}
              fontWeight="semibold"
              color="mint"
              fontSize="10px"
            >
              주간 목표
            </Flex>
          </Flex>
          <Grid
            ml={4}
            flex={1}
            templateColumns="repeat(2,1fr)"
            templateRows="repeat(4,1fr)"
            gap="8px"
          >
            {timeArr.map((time, idx) => (
              <Button
                key={idx}
                onClick={() => setTargetTime(time)}
                size="sm"
                colorScheme={time === targetTime ? "mint" : null}
                _hover={{
                  outline: "none",
                  bg: "mint",
                  boxShadow: "none",
                }}
              >
                {time ? `${time}시간` : "미참여"}
              </Button>
            ))}
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
    </>
  );
}

export default StudyChallengeModal;
