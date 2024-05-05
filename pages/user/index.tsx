import styled from "styled-components";

import Slide from "../../components/layouts/PageSlide";
import { useUserInfoQuery } from "../../hooks/user/queries";
import UserCollection from "../../pageTemplates/user/userCollection";
import UserHeader from "../../pageTemplates/user/userHeader";
import UserOverview from "../../pageTemplates/user/userOverview/UserOverView";
import UserProfile from "../../pageTemplates/user/userProfile";

function UserInfo() {
  const { data: userInfo } = useUserInfoQuery({});

  return (
    <>
      <UserHeader />
      <Slide>
        {userInfo && (
          <UserLayout>
            <UserOverview />
            <UserProfile />
            <UserCollection />
          </UserLayout>
        )}
      </Slide>
    </>
  );
}

const UserLayout = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

export default UserInfo;
