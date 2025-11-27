import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { Input } from "../../components/atoms/Input";
import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import { PlusIcon } from "../../components/Icons/MathIcons";
import InviteUserGroups from "../../components/molecules/groups/InviteUserGroups";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import { useAllUserDataQuery } from "../../hooks/admin/quries";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useRealtimeInviteMutation } from "../../hooks/realtime/mutations";
import { useStudyInviteMutation } from "../../hooks/study/mutations";
import { RealTimeVoteProps } from "../../types/models/studyTypes/requestTypes";
import {
  StudyConfirmedMemberProps,
  StudyPlaceProps,
} from "../../types/models/studyTypes/study-entity.types";
import { StudyType } from "../../types/models/studyTypes/study-set.types";
import { StudyVoteProps } from "../../types/models/studyTypes/studyInterActions";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { searchName } from "../../utils/stringUtils";

interface IStudyDateBar {
  date: string;
  members: StudyConfirmedMemberProps[];
  studyType: StudyType;
  placeInfo: StudyPlaceProps;
}
function StudyDateBar({ date, members, studyType, placeInfo }: IStudyDateBar) {
  const memberIdArr = members?.map(
    (member) => (member as StudyConfirmedMemberProps)?.user._id || "",
  );
  const typeToast = useTypeToast();
  const toast = useToast();
  const resetStudy = useResetStudyQuery();
  const [isModal, setIsModal] = useState(false);

  const { mutate: inviteStudy, isLoading: isLoading1 } = useStudyInviteMutation(date, {
    onSuccess() {
      resetStudy();
      typeToast("invite");
      setIsModal(false);
    },
  });
  const { mutate: inviteRealTimes, isLoading: isLoading2 } = useRealtimeInviteMutation(date, {
    onSuccess() {
      resetStudy();
      typeToast("invite");
      setIsModal(false);
    },
  });

  const { data: usersAll, isLoading } = useAllUserDataQuery(null, { enabled: isModal });

  const [inviteUser, setInviteUser] = useState<UserSimpleInfoProps>(null);
  const [users, setUsers] = useState<UserSimpleInfoProps[]>(null);
  const [existUsers, setExistUsers] = useState<string[]>(memberIdArr);
  const [nameValue, setNameValue] = useState("");

  useEffect(() => {
    if (nameValue) setUsers(searchName(usersAll as UserSimpleInfoProps[], nameValue));
    else setUsers(usersAll as UserSimpleInfoProps[]);
  }, [nameValue, usersAll]);

  useEffect(() => {
    if (!inviteUser) return;
    if (studyType === "soloRealTimes" || studyType === "openRealTimes") {
      const voteInfo: RealTimeVoteProps = {
        place: {
          latitude: placeInfo?.location.latitude,
          longitude: placeInfo?.location.longitude,
          name: placeInfo?.location.name,
          address: placeInfo?.location.address,
        },
        time: {
          start: dayjs().hour(2),
          end: dayjs().hour(6),
        },
        status: studyType === "soloRealTimes" ? "solo" : "participation",
      };
      inviteRealTimes({ userId: inviteUser._id, ...voteInfo });
    } else {
      const voteInfo: StudyVoteProps = {
        latitude: placeInfo?.location.latitude,
        longitude: placeInfo?.location.longitude,
        locationDetail: placeInfo?.location.address,
        start: dayjs(),
        end: dayjs().add(4, "hour"),
        eps: 3,
      };
      inviteStudy({ userId: inviteUser._id, ...voteInfo });
    }
    setUsers((old) => old.filter((who) => who.uid !== inviteUser.uid));
    setExistUsers((old) => [...old, inviteUser._id]);
    setInviteUser(null);
  }, [inviteUser]);

  const handleClick = () => {
    if (
      studyType !== "openRealTimes" ||
      dayjs(date).startOf("day").isBefore(dayjs().subtract(1, "day"))
    ) {
      toast("warning", "확정된 모임장 스터디에서만 초대가 가능합니다.");
      return;
    }
    setIsModal(true);
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
      {isModal && (
        <RightDrawer title="인원 초대" onClose={() => setIsModal(false)}>
          <Box mt="16px">
            <Input
              placeholder="이름 검색"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              size="md"
            />
          </Box>
          <Box
            mb={5}
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {!isLoading && !isLoading1 && !isLoading2 && users ? (
              <InviteUserGroups
                users={users}
                inviteUser={(who) => setInviteUser(who)}
                existUsers={existUsers}
              />
            ) : (
              <MainLoadingAbsolute />
            )}
          </Box>
        </RightDrawer>
      )}
    </>
  );
}

export default StudyDateBar;
