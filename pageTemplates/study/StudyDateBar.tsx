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
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { useGroupIdQuery } from "../../hooks/groupStudy/queries";
import { useRealtimeInviteMutation } from "../../hooks/realtime/mutations";
import { useStudyInviteMutation, useStudyVoteArrMutation } from "../../hooks/study/mutations";
import { DispatchType } from "../../types/hooks/reactTypes";
import { RealTimeVoteProps } from "../../types/models/studyTypes/requestTypes";
import {
  StudyConfirmedMemberProps,
  StudyPlaceProps,
} from "../../types/models/studyTypes/study-entity.types";
import { StudyType } from "../../types/models/studyTypes/study-set.types";
import { StudyVoteProps } from "../../types/models/studyTypes/studyInterActions";
import { IUserSummary, UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
import { searchName } from "../../utils/stringUtils";

interface IStudyDateBar {
  date: string;
  members: StudyConfirmedMemberProps[];
  studyType: StudyType;
  placeInfo: StudyPlaceProps;
}
interface PlaceProps {
  locationDetail: string;
  latitude: number;
  longitude: number;
}

function StudyDateBar({ date, members, studyType, placeInfo }: IStudyDateBar) {
  const memberIdArr = members?.map(
    (member) => (member as StudyConfirmedMemberProps)?.user._id || "",
  );
  const typeToast = useTypeToast();
  const toast = useToast();
  const resetStudy = useResetStudyQuery();
  const userInfo = useUserInfo();
  const [isModal, setIsModal] = useState(false);

  const [placeProps, setPlaceProps] = useState<PlaceProps>();

  const [inviteUser, setInviteUser] = useState<UserSimpleInfoProps>(null);
  const [dateArr, setDateArr] = useState<string[]>([]);

  const { mutate: inviteStudy } = useStudyInviteMutation(date, {
    onSuccess() {
      resetStudy();
      typeToast("invite");
      setIsModal(false);
    },
  });
  const { mutate: inviteRealTimes } = useRealtimeInviteMutation(date, {
    onSuccess() {
      resetStudy();
      typeToast("invite");
      setIsModal(false);
    },
  });
  const { mutate: voteDateArr } = useStudyVoteArrMutation(dateArr, {
    onSuccess() {
      // if (selectedDates.length) {
      //   if (canChange) {
      //     toast("success", "스터디 변경 완료!");
      //   } else {
      //     toast("success", "스터디 신청 완료!");
      //   }
      // } else {
      //   toast("success", "스터디 취소 완료!");
      // }
      // resetStudy();
      // onClose();
    },
  });

  useEffect(() => {
    if (!inviteUser) return;
    if (placeProps) {
      voteDateArr({
        ...placeProps,
        userId: inviteUser._id,
        start: dayjs(date).hour(14).minute(0),
        end: dayjs(date).hour(18).minute(0),
        eps: 1,
      });
      return;
    }

    if (studyType === "soloRealTimes" || studyType === "openRealTimes") {
      const voteInfo: RealTimeVoteProps = {
        place: {
          latitude: placeInfo?.location.latitude,
          longitude: placeInfo?.location.longitude,
          name: placeInfo?.location.name,
          address: placeInfo?.location.address,
        },
        time: {
          start: dayjs().hour(14).minute(0),
          end: dayjs().hour(18).minute(0),
        },
        status: studyType === "soloRealTimes" ? "solo" : "participation",
      };
      inviteRealTimes({ userId: inviteUser._id, ...voteInfo });
    } else {
      const voteInfo: StudyVoteProps = {
        latitude: placeInfo?.location.latitude,
        longitude: placeInfo?.location.longitude,
        locationDetail: placeInfo?.location.address,
        start: dayjs(date).hour(14).minute(0),
        end: dayjs(date).hour(18).minute(0),
        eps: 3,
      };
      inviteStudy({ userId: inviteUser._id, ...voteInfo });
    }

    setInviteUser(null);
  }, [inviteUser]);

  const isAdmin = userInfo?.role === "previliged";

  const handleClick = () => {
    if (
      !isAdmin &&
      (studyType !== "openRealTimes" ||
        dayjs(date).startOf("day").isBefore(dayjs().subtract(1, "day")))
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
        <InviteDrawer
          onClose={() => setIsModal(false)}
          handleClick={(who, place) => {
            setInviteUser(who);
            setPlaceProps(place);
          }}
          date={date}
          dateArr={dateArr}
          setDateArr={setDateArr}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
}

interface InviteDrawerProps {
  isAdmin: boolean;
  onClose: () => void;
  handleClick: (who: IUserSummary, place: PlaceProps) => void;
  dateArr: string[];
  setDateArr: DispatchType<string[]>;
  date: string;
}

type PlaceType = "강남" | "홍대" | "사당";

function InviteDrawer({
  isAdmin,
  onClose,
  handleClick,
  dateArr,
  setDateArr,
  date,
}: InviteDrawerProps) {
  const [users, setUsers] = useState<UserSimpleInfoProps[]>(null);
  const [nameValue, setNameValue] = useState("");
  const [placeName, setPlaceName] = useState<PlaceType>();

  const { data: group } = useGroupIdQuery("118");

  const { data: usersAll, isLoading } = useAllUserDataQuery("study");

  const placeArr: PlaceType[] = ["강남", "홍대", "사당"];

  useEffect(() => {
    if (!usersAll || !group) return;
    const groupUsers = group.participants.map((par) => par.user);
    const totalUsers = Array.from(
      new Map([...groupUsers, ...usersAll].map((user) => [user.uid, user])).values(),
    );

    if (nameValue) setUsers(searchName(totalUsers as UserSimpleInfoProps[], nameValue));
    else setUsers(totalUsers as UserSimpleInfoProps[]);
  }, [nameValue, usersAll, group]);

  const PLACE_MAPPING: Record<PlaceType, PlaceProps> = {
    강남: {
      locationDetail: "서울특별시 강남구 역삼동 827-13 1층",
      latitude: 37.496193,
      longitude: 127.030907,
    },
    홍대: {
      locationDetail: "서울특별시 강남구 역삼동 827-13 1층",
      latitude: 37.496193,
      longitude: 127.030907,
    },
    사당: {
      locationDetail: "서울특별시 강남구 역삼동 827-13 1층",
      latitude: 37.496193,
      longitude: 127.030907,
    },
  };

  return (
    <RightDrawer title="인원 초대" onClose={onClose}>
      {isAdmin && (
        <>
          <Flex mb={2}>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <Button
                key={n}
                onClick={() => {
                  if (dateArr.includes(dayjsToStr(dayjs(date).add(n, "day")))) {
                    setDateArr((old) =>
                      old.filter((o) => o !== dayjsToStr(dayjs(date).add(n, "day"))),
                    );
                  } else {
                    setDateArr((old) => [...old, dayjsToStr(dayjs(date).add(n, "day"))]);
                  }
                }}
                colorScheme={
                  dateArr.includes(dayjsToStr(dayjs(date).add(n, "day"))) ? "mint" : "gray"
                }
              >
                {dayjsToFormat(dayjs(date).add(n, "day"), "D(ddd)")}
              </Button>
            ))}
          </Flex>
          <Flex justify="space-between">
            {placeArr.map((place) => (
              <Button
                key={place}
                colorScheme={placeName === place ? "mint" : "gray"}
                onClick={() => {
                  setPlaceName(place);
                }}
              >
                {place}
              </Button>
            ))}
          </Flex>
        </>
      )}
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
        {!isLoading && users ? (
          <InviteUserGroups
            users={users}
            inviteUser={(who) => {
              handleClick(who, PLACE_MAPPING[placeName]);
              setUsers((old) => old.filter((who) => who.uid !== who.uid));
            }}
          />
        ) : (
          <MainLoadingAbsolute />
        )}
      </Box>
    </RightDrawer>
  );
}

export default StudyDateBar;
