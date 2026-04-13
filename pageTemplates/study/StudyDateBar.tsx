import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import { PlusIcon } from "../../components/Icons/MathIcons";
import { StudyInviteDrawer } from "../../components/services/study/invite/StudyInviteDrawer";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { StudyConfirmedMemberProps } from "../../types/models/studyTypes/study-entity.types";
import { StudyType } from "../../types/models/studyTypes/study-set.types";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface IStudyDateBar {
  date: string;
  members: StudyConfirmedMemberProps[];
  studyType: StudyType;
}

function StudyDateBar({ date, members, studyType }: IStudyDateBar) {
  const memberIdArr = members?.map(
    (member) => (member as StudyConfirmedMemberProps)?.user._id || "",
  );

  const toast = useToast();

  const userInfo = useUserInfo();
  const [isModal, setIsModal] = useState(false);

  // const { mutate: inviteRealTimes } = useRealtimeInviteMutation(date, {
  //   onSuccess() {
  //     resetStudy();
  //     typeToast("invite");
  //   },
  // });
  // const { mutate: voteDateArr } = useStudyVoteArrMutation(dateArr, {
  //   onSuccess() {
  //     // if (selectedDates.length) {
  //     //   if (canChange) {
  //     //     toast("success", "스터디 변경 완료!");
  //     //   } else {
  //     //     toast("success", "스터디 신청 완료!");
  //     //   }
  //     // } else {
  //     //   toast("success", "스터디 취소 완료!");
  //     // }
  //     // resetStudy();
  //     // onClose();
  //   },
  // });

  // if (studyType === "soloRealTimes" || studyType === "openRealTimes") {
  //   const voteInfo: RealTimeVoteProps = {
  //     place: {
  //       latitude: placeInfo?.location.latitude,
  //       longitude: placeInfo?.location.longitude,
  //       name: placeInfo?.location.name,
  //       address: placeInfo?.location.address,
  //     },
  //     time: {
  //       start: dayjs().hour(14).minute(0),
  //       end: dayjs().hour(18).minute(0),
  //     },
  //     status: studyType === "soloRealTimes" ? "solo" : "participation",
  //   };
  //   inviteRealTimes({ userId: inviteUser._id, ...voteInfo });
  // } else {
  //   const voteInfo: StudyVoteProps = {
  //     latitude: placeInfo?.location.latitude,
  //     longitude: placeInfo?.location.longitude,
  //     locationDetail: placeInfo?.location.address,
  //     start: dayjs(date).hour(14).minute(0),
  //     end: dayjs(date).hour(18).minute(0),
  //     eps: 3,
  //   };
  //   inviteStudy({ userId: inviteUser._id, ...voteInfo });
  // }

  const isAdmin = userInfo?.role === "previliged";

  const handleClick = () => {
    if (isAdmin) {
      setIsModal(true);
      return;
    }
    toast("info", "스터디 개설자만 사용할 수 있어요!");
  };

  return (
    <>
      <Box mt={5} mb={2}>
        <Flex justify="space-between" align="center">
          <Box fontWeight="bold" fontSize="18px">
            {studyType === "participations"
              ? "스터디 신청 멤버"
              : studyType === "soloRealTimes"
              ? "오늘의 열공 멤버"
              : dayjsToFormat(dayjs(date), `M월 D일  참여 멤버`)}
          </Box>
          <Button variant="unstyled" onClick={handleClick}>
            <PlusIcon color="mint" size="sm" />
          </Button>
        </Flex>
        <Box mt={1} fontSize="12px" color="gray.500">
          현재 <b>{memberIdArr?.length || 0}명의 멤버</b>가{" "}
          {studyType === "participations" ? "스터디를 기다리고 있어요!" : "참여중이에요!"}
        </Box>
      </Box>
      {isModal && <StudyInviteDrawer onClose={() => setIsModal(false)} />}
    </>
  );
}

export default StudyDateBar;
