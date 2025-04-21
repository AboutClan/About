import { Button } from "@chakra-ui/react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import Divider from "../../components/atoms/Divider";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useGroupsTitleQuery } from "../../hooks/groupStudy/queries";
import { useUserIdToUserInfoQuery } from "../../hooks/user/queries";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGuest = session ? session.user.name === "guest" : undefined;

  const isDeclare = searchParams.get("declare") === "on";

  const { userId } = useParams<{ userId: string }>() || {};

  const setTransferUserName = useSetRecoilState(transferUserName);
  const [declareModal, setDeclareModal] = useState<DeclareRequest>();

  const { data: user } = useUserIdToUserInfoQuery(userId as string, {
    enabled: !!userId,
  });

  const { data } = useGroupsTitleQuery(userId, {
    enabled: !!userId,
  });

  const groups = data?.map((props) => props.title);

  useEffect(() => {
    if (user) setTransferUserName(user.name);
  }, [user]);

  const handleDrawer = (type: "chat" | "declare") => {
    if (isGuest) {
      typeToast("guest");
      return;
    }
    if (type === "chat") router.push(`/chat/${user._id}`);
    if (type === "declare") router.replace(`/profile/${userId}?declare=on`);
  };

  return (
    <>
      <Header title="" rightPadding={8}>
        <Button px="12px" size="md" variant="ghost" onClick={() => handleDrawer("chat")}>
          <i className="fa-regular fa-paper-plane fa-lg" />
        </Button>
        <Button px="12px" size="md" variant="ghost" onClick={() => handleDrawer("declare")}>
          <i className="fa-regular fa-ellipsis fa-lg" />
        </Button>
      </Header>
      <Slide>
        <ProfileOverview user={user as IUser} />
      </Slide>
      <Slide isNoPadding>
        <Divider />
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
      />
    </>
  );
}

export default ProfilePage;
