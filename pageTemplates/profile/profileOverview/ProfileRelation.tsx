import { Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import { useCompleteToast, useFailToast } from "../../../hooks/custom/CustomToast";
import { useUserFriendMutation } from "../../../hooks/user/mutations";
import { useInteractionMutation } from "../../../hooks/user/sub/interaction/mutations";
import ProfileCardModal from "../../../modals/profile/ProfileCardModal";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";

interface IProfileRelation {
  user: IUser;
}

function ProfileRelation({ user }: IProfileRelation) {
  const failGuestToast = useFailToast();
  const completeToast = useCompleteToast();
  const { data: session } = useSession();

  const isGuest = session?.user.name === "guest";
  const [modalType, setModalType] = useState<"requestFriend" | "cancelFriend" | "isMyProfile">();
  const [isMyFriend, setIsMyFriend] = useState(false);

  const { mutate: requestFriend } = useInteractionMutation("friend", "post", {
    onSuccess() {
      completeToast("free", "친구 요청이 전송되었습니다.");
      setModalType(null);
    },
  });

  const { mutate: deleteFriend } = useUserFriendMutation("delete", {
    onSuccess() {
      completeToast("free", "친구 목록에서 삭제되었습니다.");
      setIsMyFriend(false);
      setModalType(null);
    },
  });

  useEffect(() => {
    if (user?.friend?.some((who) => who === session?.user?.uid)) {
      setIsMyFriend(true);
    }
  }, [session?.user?.uid, user?.friend]);

  const onClickCard = () => {
    if (isGuest) {
      failGuestToast("guest");
      return;
    }
    setModalType("isMyProfile");
  };

  const alertModalOptions: IAlertModalOptions = {
    title: "친구 요청",
    subTitle: "친구 요청을 보내시겠습니까?",
    func: () =>
      requestFriend({
        toUid: user?.uid,
        message: `${session?.user?.name}님의 친구추가 요청`,
      }),
    text: "전송",
  };

  const cancelAlertModalOptions: IAlertModalOptions = {
    title: "친구 삭제",
    subTitle: "친구 목록에서 삭제하시겠습니까?",
    func: () => deleteFriend(user.uid),
    text: "전송",
  };

  return (
    <>
      <Layout>
        <div>
          <RelationItem>
            <span>친구</span>
            <span>{user?.friend?.length}</span>
          </RelationItem>
          <RelationItem>
            <span>좋아요</span>
            <span>{user?.like || 0}</span>
          </RelationItem>
          <RelationItem>
            <span>활동</span>
            <span>0</span>
          </RelationItem>
        </div>
        {user && user?.uid !== session?.user?.uid ? (
          !isMyFriend ? (
            <Button
              backgroundColor="var(--color-mint)"
              color="white"
              size="sm"
              onClick={() => setModalType("requestFriend")}
            >
              친구 요청
            </Button>
          ) : (
            <Button
              variant="outline"
              color="var(--color-mint)"
              borderColor="var(--color-mint)"
              size="sm"
              onClick={() => setModalType("cancelFriend")}
            >
              친구 취소
            </Button>
          )
        ) : (
          <Button onClick={onClickCard} size="sm">
            내 프로필 카드
          </Button>
        )}
      </Layout>
      {modalType === "isMyProfile" && <ProfileCardModal setIsModal={() => setModalType(null)} />}
      {modalType === "requestFriend" && (
        <AlertModal options={alertModalOptions} setIsModal={() => setModalType(null)} />
      )}
      {modalType === "cancelFriend" && (
        <AlertModal options={cancelAlertModalOptions} setIsModal={() => setModalType(null)} />
      )}
    </>
  );
}

const Layout = styled.div`
  display: flex;
  margin-top: var(--gap-5);
  align-items: center;
  justify-content: space-between;
  > div:first-child {
    display: flex;
  }
`;

const RelationItem = styled.div`
  width: max-content;
  padding: 0 var(--gap-2);
  text-align: center;
  display: flex;
  flex-direction: column;
  line-height: 2;
  > span:first-child {
    font-size: 12px;
  }
  > span:last-child {
    font-size: 12px;
    font-weight: 600;
  }
`;
export default ProfileRelation;
