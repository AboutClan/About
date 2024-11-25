import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import { USER_ROLE } from "../../constants/settingValue/role";
import { IFooterOptions, ModalLayout } from "../../modals/Modals";
import { UserActiveSummaryProps, UserAttendInfo } from "../../pages/admin/response/locationActive";
import { birthToAge } from "../../utils/convertUtils/convertTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";
interface ProfileDetailBlockProps {
  attendInfo: UserAttendInfo;
  user: UserActiveSummaryProps;
}

function ProfileDetailBlock({ user, attendInfo }: ProfileDetailBlockProps) {
  const [isInfoModal, setIsInfoModal] = useState(false);

  function InfoModal() {
    const modalFooter: IFooterOptions = {
      main: {},
      sub: {},
    };
    return (
      <ModalLayout
        title={`${user.name}님의 정보`}
        setIsModal={setIsInfoModal}
        footerOptions={modalFooter}
      >
        <Box>상태: 확인 필요</Box>
        <Box>상태: 위험</Box>
        <Box>상태: 위험</Box>
        <Box>상태: 위험</Box>
        <Box>상태: 위험</Box>
      </ModalLayout>
    );
  }

  return (
    <>
      <Flex border="var(--border-main)" pl={2}>
        <Flex
          flexDir="column"
          justify="space-around"
          align="center"
          pr={2}
          borderRight="var(--border-main)"
        >
          <Avatar
            userId={user._id}
            uid={user.uid}
            avatar={user?.avatar}
            image={user.profileImage}
            size="md"
          />
          <Box>{user.name}</Box>
        </Flex>
        <Flex direction="column" flex={1}>
          <Flex p={2} borderBottom="var(--border-main)" pr={3}>
            <Box flex={1.4}>{USER_ROLE[user.role]}</Box>
            <Box flex={0.9}>{birthToAge(user.birth)}세</Box>
            <Box flex={1.4}>생략</Box>
            <Box flex={2}>{dayjsToStr(dayjs(user.registerDate))}</Box>{" "}
            <Box flex={1} textAlign="center">
              {attendInfo.studyCnt === 0 &&
              dayjs(user.registerDate).isBefore(dayjs().subtract(2, "week")) ? (
                <i className="fa-regular fa-x" style={{ color: "var(--color-red)" }} />
              ) : (
                <i className="fa-regular fa-circle" />
              )}
            </Box>
          </Flex>
          <Flex align="center" py={2} pl={2} pr={2}>
            <Box flex={1.3}>
              스터디 {attendInfo.studyCnt}({attendInfo.selfStudyCnt})회
            </Box>
            <Box flex={0.8}>번개 {attendInfo.gatherCnt}회</Box>
            <Box flex={1}>소모임 {attendInfo.groupCnt}회</Box>
            <Button
              ml="auto"
              mr={1}
              size="sm"
              colorScheme="mint"
              onClick={() => setIsInfoModal(true)}
            >
              정보
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {isInfoModal && <InfoModal />}
    </>
  );
}

export default ProfileDetailBlock;
