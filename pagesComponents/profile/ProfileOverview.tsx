import { useState } from "react";
import styled from "styled-components";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { IUser } from "../../types/user/user";
import ProfileInfo from "./profileOverview/ProfileInfo";

import ProfileRelation from "./profileOverview/ProfileRelation";
import ProfileOverviewSkeleton from "./skeleton/ProfileOverviewSkeleton";

interface IProfileOverview {
  user?: IUser;
}

function ProfileOverview({ user }: IProfileOverview) {
  const [userData, setUserData] = useState<IUser>(user);
  const [isLoading, setIsLoading] = useState(true);

  useUserInfoQuery({
    onSuccess(data) {
      if (!userData) setUserData(data);
      setIsLoading(false);
    },
  });

  return (
    <>
      {!isLoading ? (
        <Layout>
          <ProfileInfo user={userData} />
          <ProfileRelation user={user} />
        </Layout>
      ) : (
        <ProfileOverviewSkeleton />
      )}
    </>
  );
}

const Layout = styled.div`
  margin: 0 var(--margin-main);
  padding: var(--padding-sub) 0;
  display: flex;
  flex-direction: column;
`;

export default ProfileOverview;
