import { Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import AlertModal, { IAlertModalOptions } from "../../../components/AlertModal";
import { useFailToast, useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useUserFriendMutation } from "../../../hooks/user/mutations";
import { useInteractionMutation } from "../../../hooks/user/sub/interaction/mutations";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";

interface IProfileRelation {
  user: IUser;
}

function ProfileRelation({ user }: IProfileRelation) {
  const failGuestToast = useFailToast();
  const router = useRouter();
  const typeToast = useTypeToast();
  const toast = useToast();
  const { data: session } = useSession();

  const isGuest = session?.user.name === "guest";
  const [modalType, setModalType] = useState<"requestFriend" | "cancelFriend">();
  const [isMyFriend, setIsMyFriend] = useState(false);

  const { mutate: requestFriend } = useInteractionMutation("friend", "post", {
    onSuccess() {
      toast("success", "친구 요청이 전송되었습니다.");
      setModalType(null);
    },
  });

  const { mutate: deleteFriend } = useUserFriendMutation("delete", {
    onSuccess() {
      toast("success", "친구 목록에서 삭제되었습니다.");
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
    router.push("/user");
  };

  const alertModalOptions: IAlertModalOptions = {
    title: "친구 요청",
    subTitle: "친구 요청을 보내시겠습니까?",
    func: () => {
      requestFriend({
        toUid: user?.uid,
        message: `${session?.user?.name}님의 친구추가 요청`,
      });
    },
    text: "전송",
  };

  const cancelAlertModalOptions: IAlertModalOptions = {
    title: "친구 삭제",
    subTitle: "친구 목록에서 삭제하시겠습니까?",
    func: () => deleteFriend(user.uid),
    text: "전송",
  };

  const isPrivate =
    user?.isPrivate && !user?.friend.includes(session?.user.uid) && user?.uid !== session?.user.uid;

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
        <Flex align="center">
          {isPrivate && user?.instagram && (
            <>
              <Link href={`https://www.instagram.com/${user.instagram}`}>
                <Flex
                  justify="center"
                  align="center"
                  w="32px"
                  h="32px"
                  bgColor="var(--gray-100)"
                  border="var(--border)"
                  borderRadius="50%"
                  mr="12px"
                >
                  <InstagramIcon />
                </Flex>
              </Link>
            </>
          )}

          {user && user?.uid !== session?.user?.uid ? (
            !isMyFriend ? (
              <Button
                backgroundColor="var(--color-mint)"
                color="white"
                size="sm"
                onClick={() => {
                  if (isGuest) {
                    typeToast("guest");
                    return;
                  }
                  setModalType("requestFriend");
                }}
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
              내 프로필 수정
            </Button>
          )}
        </Flex>
      </Layout>

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

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="var(--gray-600)"
      width="16px"
      height="16px"
      viewBox="0 0 448 512"
    >
      <path
        fill="var(--gray-600)"
        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
      />
    </svg>
  );
}
