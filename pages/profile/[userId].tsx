import { Button } from "@chakra-ui/react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
import Divider from "../../components/atoms/Divider";
import { EllipsisIcon } from "../../components/Icons/DotIcons";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useGroupsTitleQuery } from "../../hooks/groupStudy/queries";
import { useUserFriendMutation } from "../../hooks/user/mutations";
import { useUserIdToUserInfoQuery } from "../../hooks/user/queries";
import { useInteractionMutation } from "../../hooks/user/sub/interaction/mutations";
import BottomDrawer from "../../pageTemplates/profile/BottomDrawer";
import DeclareDrawer from "../../pageTemplates/profile/DeclareDrawer";
import DetailInfo from "../../pageTemplates/profile/DetailInfo";
import ProfileOverview from "../../pageTemplates/profile/ProfileOverview";
import { transferUserName } from "../../recoils/transferRecoils";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { DeclareRequest } from "../../types/models/userTypes/userRequestTypes";

function ProfilePage() {
  const { data: session } = useSession();
  const typeToast = useTypeToast();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuest = session ? session.user.name === "guest" : undefined;

  const isDeclare = searchParams.get("declare") === "on";

  const { userId } = useParams<{ userId: string }>() || {};

  const [modalType, setModalType] = useState<"add" | "remove">(null);
  const setTransferUserName = useSetRecoilState(transferUserName);
  const [declareModal, setDeclareModal] = useState<DeclareRequest>();

  const { data: user } = useUserIdToUserInfoQuery(userId as string, {
    enabled: !!userId,
  });
  console.log(user);
  const { data } = useGroupsTitleQuery(userId, {
    enabled: !!userId,
  });

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

  const groups = data?.map((props) => props.title);

  useEffect(() => {
    if (user) setTransferUserName(user.name);

    if (user?.friend?.some((who) => who === session?.user?.uid)) {
      setIsMyFriend(true);
    }
  }, [user, session]);

  const handleDrawer = (type: "chat" | "declare") => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    if (type === "chat") router.push(`/chat/${user._id}`);
    if (type === "declare") router.replace(`/profile/${userId}?declare=on`);
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

  return (
    <>
      <Header title="">
        <Button
          mr={1.5}
          display="flex"
          w={8}
          h={8}
          variant="unstyled"
          color="gray.800"
          onClick={() => setModalType(isMyFriend ? "remove" : "add")}
        >
          {session?.user.id === userId ? null : isMyFriend ? (
            <i className="fa-regular fa-user-check fa-lg" style={{ color: "var(--gray-500)" }} />
          ) : (
            <i className="fa-regular fa-user-plus fa-lg" />
          )}
        </Button>
        <Button
          mr={2}
          display="flex"
          w={8}
          h={8}
          variant="unstyled"
          onClick={() => handleDrawer("chat")}
        >
          <i className="fa-regular fa-paper-plane fa-lg" />
        </Button>
        <Button
          display="flex"
          w={8}
          h={8}
          size="md"
          variant="unstyled"
          onClick={() => handleDrawer("declare")}
        >
          <EllipsisIcon size="lg" color="dark" />
        </Button>
      </Header>
      <Slide>
        <ProfileOverview user={user as IUser} groupCnt={groups?.length} />
      </Slide>
      <Slide isNoPadding>
        <Divider type={200} />
      </Slide>
      <Slide>
        <DetailInfo user={user as IUser} groups={groups} />
      </Slide>
      {isDeclare && (
        <BottomDrawer
          onClose={() => {
            router.replace(`/profile/${userId}`);
          }}
          setDeclareModal={setDeclareModal}
        />
      )}
      <DeclareDrawer
        userData={user}
        declareModal={declareModal}
        setDeclareModal={setDeclareModal}
      />{" "}
      {modalType === "add" && (
        <AlertModal options={alertModalOptions} setIsModal={() => setModalType(null)} />
      )}
      {modalType === "remove" && (
        <AlertModal options={cancelAlertModalOptions} setIsModal={() => setModalType(null)} />
      )}
    </>
  );
}

export default ProfilePage;
