import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import { STUDY_RECORD_MODAL_AT } from "../../constants/keys/queryKeys";
import { CloseProps } from "../../types/components/modalTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import BottomFlexDrawer from "../organisms/drawer/BottomFlexDrawer";

export interface StudyRecordDrawerProps extends CloseProps {
  date: string;
}

function StudyRecordDrawer({ date = "2025-05-13", onClose }: StudyRecordDrawerProps) {
  return (
    <BottomFlexDrawer isDrawerUp isOverlay height={412} isHideBottom setIsModal={onClose}>
      <Box
        py={3}
        lineHeight="32px"
        w="100%"
        fontWeight="semibold"
        fontSize="20px"
        textAlign="start"
      >
        {dayjsToFormat(dayjs(date).locale("ko"), "M월 D일(ddd)")} 스터디 기록이 도착했어요. <br />{" "}
        기록을 확인해볼까요?
      </Box>
      <Box p={5}>
        <Image
          src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/recordBook.png"
          width={160}
          height={160}
          alt="studyResult"
        />
      </Box>

      <Flex direction="column" mt="8px" w="100%" mb="auto">
        <Link href={`/study/result?date=${date}`} style={{ width: "100%" }}>
          <Button as="div" w="full" size="lg" colorScheme="black">
            확인 하러가기
          </Button>
        </Link>
        <Button
          my={2}
          h="24px"
          color="gray.500"
          fontWeight="semibold"
          variant="ghost"
          onClick={() => {
            onClose();
            localStorage.setItem(STUDY_RECORD_MODAL_AT, null);
          }}
        >
          무시하고 넘기기
        </Button>
      </Flex>
    </BottomFlexDrawer>
  );
}

export default StudyRecordDrawer;
