import { Button } from "@chakra-ui/react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useUidToUserInfoQuery } from "../../hooks/user/queries";
import BottomDrawer from "../../pageTemplates/profile/BottomDrawer";
import DeclareDrawer from "../../pageTemplates/profile/DeclareDrawer";
import DetailInfo from "../../pageTemplates/profile/DetailInfo";
import ProfileOverview from "../../pageTemplates/profile/ProfileOverview";
import { prevPageUrlState } from "../../recoils/previousAtoms";
import { transferUserName } from "../../recoils/transferRecoils";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { DeclareRequest } from "../../types/models/userTypes/userRequestTypes";

function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const beforePage = useRecoilValue(prevPageUrlState);

  const isDeclare = searchParams.get("declare") === "on";

  const { uid } = useParams<{ uid: string }>() || {};

  const setTransferUserName = useSetRecoilState(transferUserName);
  const [declareModal, setDeclareModal] = useState<DeclareRequest>();

  const { data: user } = useUidToUserInfoQuery(uid as string, {
    enabled: !!uid,
  });

  useEffect(() => {
    if (user) setTransferUserName(user.name);
  }, [user]);

  const handleDrawer = () => {
    router.replace(`/profile/${uid}?declare=on`);
  };

  return (
    <>
      <Header title="" url={beforePage} rightPadding={8}>
        <Button
          px="12px"
          size="md"
          variant="ghost"
          onClick={() => router.push(`/chat/${user._id}`)}
        >
          <i className="fa-regular fa-paper-plane fa-lg" />
        </Button>
        <Button px="12px" size="md" variant="ghost" onClick={handleDrawer}>
          <i className="fa-regular fa-ellipsis fa-lg" />
        </Button>
      </Header>
      <Slide>
        <Container>
          <Layout>
            <ProfileOverview user={user as IUser} />
            <HrDiv />
            <DetailInfo user={user as IUser} />
          </Layout>
        </Container>
      </Slide>
      {isDeclare && (
        <BottomDrawer
          onClose={() => {
            router.replace(`/profile/${uid}`);
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

const Container = styled.div`
  background-color: white;
`;

const Layout = styled.div``;

const HrDiv = styled.div`
  background-color: var(--gray-200);
  height: 10px;
`;
export default ProfilePage;
