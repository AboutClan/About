import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useUidToUserInfoQuery } from "../../hooks/user/queries";
import BottomDrawer from "../../pageTemplates/profile/BottomDrawer";
import DeclareDrawer from "../../pageTemplates/profile/DeclareDrawer";
import DetailInfo from "../../pageTemplates/profile/DetailInfo";
import ProfileOverview from "../../pageTemplates/profile/ProfileOverview";
import { prevPageUrlState } from "../../recoils/previousAtoms";
import { transferUserSummaryState } from "../../recoils/transferRecoils";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { DeclareRequest } from "../../types/models/userTypes/userRequestTypes";

function ProfilePage() {
  const router = useRouter();
  const userData = useRecoilValue(transferUserSummaryState);
  const beforePage = useRecoilValue(prevPageUrlState);

  const uid = router.query.uid;

  const [isModal, setIsModal] = useState(false);
  const [declareModal, setDeclareModal] = useState<DeclareRequest>();

  const { data: userInfo } = useUidToUserInfoQuery(uid as string, {
    enabled: !!uid && !userData,
  });

  return (
    <>
      <Header title="" url={beforePage}>
        <Button pr="4px" variant="ghost">
          <i className="fa-solid fa-ellipsis-vertical fa-lg" onClick={() => setIsModal(true)} />
        </Button>
      </Header>
      <Slide>
        <Container>
          <Layout>
            <ProfileOverview user={(userData as IUser) || userInfo} />
            <HrDiv />
            <DetailInfo user={(userData as IUser) || userInfo} />
          </Layout>
        </Container>
      </Slide>
      <BottomDrawer isModal={isModal} setIsModal={setIsModal} setDeclareModal={setDeclareModal} />
      <DeclareDrawer
        userData={(userData as IUser) || userInfo}
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
