import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import { CloseProps } from "../../types/components/modalTypes";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import BottomFlexDrawer from "../organisms/drawer/BottomFlexDrawer";

export interface GatherRecordDrawerProps extends CloseProps {
  id: string;
  date: string;
}

function GatherRecordDrawer({ id, date = dayjsToStr(dayjs()), onClose }: GatherRecordDrawerProps) {
  const handleClose = () => {
    onClose();
  };

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
        {dayjsToFormat(dayjs(date).locale("ko"), "M월 D일(ddd)")} 모임 평가표가 도착했어요. <br />{" "}
        멤버 리뷰를 남겨주세요!
      </Box>
      <Box p={5}>
        <Image src="/gatherRecord.png" width={160} height={160} alt="gatherRecord" />
      </Box>

      <Flex direction="column" mt="8px" w="100%" mb="auto">
        <Link href={`/home/gatherReview?id=${id}`} style={{ width: "100%" }}>
          <Button as="div" w="full" size="lg" colorScheme="black">
            멤버 리뷰 작성하기
          </Button>
        </Link>
        <Button
          my={2}
          h="24px"
          color="gray.500"
          fontWeight="semibold"
          variant="ghost"
          onClick={handleClose}
        >
          나중에
        </Button>
      </Flex>
    </BottomFlexDrawer>
  );
}

export default GatherRecordDrawer;
