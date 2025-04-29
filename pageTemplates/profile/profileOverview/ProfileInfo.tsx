import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import UserBadge from "../../../components/atoms/badges/UserBadge";
import { LIKE_HEART } from "../../../constants/keys/localStorage";
import { NOTICE_HEART_LOG } from "../../../constants/keys/queryKeys";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useErrorToast, useFailToast, useToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { useInteractionMutation } from "../../../hooks/user/sub/interaction/mutations";
import { IInteractionLikeStorage, IInteractionSendLike } from "../../../types/globals/interaction";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat, dayjsToStr } from "../../../utils/dateTimeUtils";

interface IProfileInfo {
  user: IUser;
}
function ProfileInfo({ user }: IProfileInfo) {
  const toast = useToast();
  const failToast = useFailToast();
  const errorToast = useErrorToast();
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const { data: userInfo } = useUserInfoQuery();

  // const [isConditionOk, setIsConditionOk] = useState(false);
  // const [isHeartLoading, setIsHeartLoading] = useState(true);

  const storedLikeArr: IInteractionLikeStorage[] = JSON.parse(localStorage.getItem(LIKE_HEART));

  const isHeart =
    storedLikeArr &&
    storedLikeArr.find(
      (who) => dayjs(who?.date) > dayjs().subtract(3, "day") && who?.uid === user?.uid,
    );

  const resetQueryData = useResetQueryData();

  const { mutate: sendHeart } = useInteractionMutation("like", "post", {
    onSuccess() {
      toast("success", "전송되었습니다!");
      resetQueryData([NOTICE_HEART_LOG]);
    },
    onError: errorToast,
  });

  // const { mutate: sendAboutPoint } = useAdminPointMutation(user?.uid);

  // useStudyAttendRecordQuery(dayjs().subtract(4, "day"), dayjs().add(1, "day"), {
  //   enabled: !isGuest,
  //   onSuccess(data) {
  //     data.forEach((study) => {
  //       study.arrivedInfoList.forEach((arrivedInfoList) => {
  //         const bothAttend = arrivedInfoList.arrivedInfo.filter(
  //           (item) => item.uid === user.uid || item.uid === session.user.uid,
  //         );
  //         if (bothAttend.length >= 2) {
  //           setIsConditionOk(true);
  //         }
  //       });
  //     });
  //     setIsHeartLoading(false);
  //   },
  // });

  const onClickHeart = () => {
    if (isGuest) {
      failToast("free", "게스트에게는 불가능합니다.");
      return;
    }
    if (isHeart) return;
    // eslint-disable-next-line prefer-const
    handleHeart();

    // let interval;
    // const checkCondition = () => {
    //   if (isHeartLoading) return;
    //   clearInterval(interval);
    //   handleHeart();
    // };

    // interval = setInterval(checkCondition, 100);
  };

  const handleHeart = () => {
    if (!userInfo?.friend.includes(user?.uid) && user.birth.slice(2) !== dayjs().format("MMDD")) {
      failToast(
        "free",
        "최근 같은 스터디에 참여한 멤버 또는 친구로 등록된 인원, 생일인 인원에게만 보낼 수 있어요!",
      );
      return;
    }

    localStorage.setItem(
      LIKE_HEART,
      JSON.stringify([
        storedLikeArr && [...storedLikeArr],
        { uid: user?.uid, date: dayjsToStr(dayjs()) },
      ]),
    );
    const data: IInteractionSendLike = {
      to: user?.uid,
      message: `${session?.user.name}님에게 좋아요를 받았어요!`,
    };
    sendHeart(data);
  };

  return (
    <>
      <Flex flexDir="column">
        <Flex align="center">
          <Avatar user={user} size="xl1" />
          <Flex ml={2} direction="column">
            <Flex>
              <Box mr={1} fontSize="16px" fontWeight="bold">
                {user?.name || session?.user.name}
              </Box>
              <Box>
                <UserBadge badgeIdx={user?.badge?.badgeIdx} />
              </Box>
            </Flex>
            <Box fontSize="12px" color="gray.500">
              {dayjsToFormat(dayjs(user?.registerDate), "YYYY년 M월 d일 가입") || "게스트"}
            </Box>
          </Flex>
          {user && user?.uid !== session?.user?.uid && (
            <Box ml="auto">
              {isHeart ? (
                <HeartWrapper onClick={onClickHeart}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="var(--color-red)"
                  >
                    <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Z" />
                  </svg>
                </HeartWrapper>
              ) : (
                <HeartWrapper onClick={onClickHeart}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="var(--gray-600)"
                  >
                    <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Zm-38-543q-29-41-62-62.5T300-774q-60 0-100 40t-40 100q0 52 37 110.5T285.5-410q51.5 55 106 103t88.5 79q34-31 88.5-79t106-103Q726-465 763-523.5T800-634q0-60-40-100t-100-40q-47 0-80 21.5T518-690q-7 10-17 15t-21 5q-11 0-21-5t-17-15Zm38 189Z" />
                  </svg>
                </HeartWrapper>
              )}
            </Box>
          )}
        </Flex>
        <Comment>{user?.comment}</Comment>
      </Flex>
    </>
  );
}

const HeartWrapper = styled.button`
  margin-right: var(--gap-1);
`;

const Comment = styled.div`
  margin-left: var(--gap-1);
  margin-top: var(--gap-3);
  color: var(--gray-800);
  font-size: 12px;
  font-weight: 600;
`;

export default ProfileInfo;
