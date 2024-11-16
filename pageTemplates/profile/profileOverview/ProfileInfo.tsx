import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import UserBadge from "../../../components/atoms/badges/UserBadge";
import { LIKE_HEART } from "../../../constants/keys/localStorage";
import { NOTICE_HEART_LOG } from "../../../constants/keys/queryKeys";
import { POINT_SYSTEM_PLUS } from "../../../constants/serviceConstants/pointSystemConstants";
import { USER_ROLE } from "../../../constants/settingValue/role";
import { useAdminPointMutation } from "../../../hooks/admin/mutation";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useCompleteToast, useErrorToast, useFailToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { useInteractionMutation } from "../../../hooks/user/sub/interaction/mutations";
import { IInteractionLikeStorage, IInteractionSendLike } from "../../../types/globals/interaction";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

interface IProfileInfo {
  user: IUser;
}
function ProfileInfo({ user }: IProfileInfo) {
  const completeToast = useCompleteToast();
  const failToast = useFailToast();
  const errorToast = useErrorToast();
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const { data: userInfo } = useUserInfoQuery();

  // const [isConditionOk, setIsConditionOk] = useState(false);
  // const [isHeartLoading, setIsHeartLoading] = useState(true);

  const status = USER_ROLE[user?.role];
  const storedLikeArr: IInteractionLikeStorage[] = JSON.parse(localStorage.getItem(LIKE_HEART));

  const isHeart =
    storedLikeArr &&
    storedLikeArr.find(
      (who) => dayjs(who?.date) > dayjs().subtract(3, "day") && who?.uid === user?.uid,
    );

  const resetQueryData = useResetQueryData();

  const { mutate: sendHeart } = useInteractionMutation("like", "post", {
    onSuccess() {
      completeToast("free", "전송되었습니다!");
      resetQueryData([NOTICE_HEART_LOG]);
    },
    onError: errorToast,
  });

  const { mutate: sendAboutPoint } = useAdminPointMutation(user?.uid);

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
    sendAboutPoint(POINT_SYSTEM_PLUS.LIKE);

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
      <Layout>
        <Profile>
          <Avatar
            userId={user._id}
            uid={user.uid}
            image={user.profileImage}
            avatar={user.avatar}
            size="xl"
          />
          <ProfileName>
            <div>
              <span>{user?.name || session?.user.name}</span>
              <UserBadge score={user?.score} uid={user?.uid} />
            </div>
            <span>{status || "게스트"}</span>
          </ProfileName>
          {user && user?.uid !== session?.user?.uid && (
            <>
              {isHeart ? (
                <HeartWrapper onClick={onClickHeart}>
                  <i className="fa-solid fa-heart fa-xl" style={{ color: "var(--color-red)" }} />
                </HeartWrapper>
              ) : (
                <HeartWrapper onClick={onClickHeart}>
                  <i className="fa-regular fa-heart fa-xl" />
                </HeartWrapper>
              )}
            </>
          )}
        </Profile>
        <Comment>{user?.comment}</Comment>
      </Layout>
    </>
  );
}

const Layout = styled.div``;
const Profile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileName = styled.div`
  margin-left: var(--gap-3);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > div:first-child {
    display: flex;
    align-items: center;
    > span:first-child {
      font-size: 16px;
      font-weight: 600;
      margin-right: var(--gap-2);
    }
  }
  > span:last-child {
    font-size: 12px;
    color: var(--gray-600);
  }
`;
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
