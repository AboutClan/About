import { Box, Button, Flex, Grid, ListItem, UnorderedList } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import InfoBoxCol, { InfoBoxProps } from "../../components/molecules/InfoBoxCol";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { IModal } from "../../types/components/modalTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

function StudyChallengeModal({ setIsModal }: IModal) {
  const toast = useToast();
  const { data: userInfo } = useUserInfoQuery();

  const today = dayjs().day() === 0 ? dayjs().add(1, "day") : dayjs();

  const [targetTime, setTargetTime] = useState<number>(10);

  const timeArr = [10, 15, 20, 25, 30, 40, 50, 60];

  const { mutate, isLoading } = useUserInfoFieldMutation("monthStudyTarget", {
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
    mutate({ monthStudyTarget: targetTime });
  };

  const infoBoxPropsArr: InfoBoxProps[] = [
    {
      category: "보유 금액",
      text: `${userInfo?.deposit}원`,
    },
    {
      category: "임시 보증금",
      text: targetTime ? "- 1000원" : "0원",
      color: "red",
    },
    {
      category: "환급 금액",
      text: `1000원 + ${targetTime * 10}원`,
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
        title={`${dayjsToFormat(today, `M월 스터디 챌린지 신청`)}`}
        footerOptions={footerOptions}
        setIsModal={setIsModal}
      >
        <Box mb={4}>
          <b>월간 공부 목표</b>를 정하고, 도전해 보세요!
          <br />
          공부 습관도 만들고, 동기부여도 받을 수 있습니다.
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
              월간 목표
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
        <UnorderedList mx={0} mt={3} fontSize="12px" color="gray.600" textAlign="start">
          <ListItem>4월은 시범 기간으로, 금액이 차감되지 않습니다.</ListItem>
          <ListItem>4월 달성자 중 추첨을 통해 상품을 지급합니다.</ListItem>
        </UnorderedList>
      </ModalLayout>{" "}
    </>
  );
}

export default StudyChallengeModal;
