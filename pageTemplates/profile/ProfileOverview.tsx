import styled from "styled-components";

import { IUser } from "../../types/models/userTypes/userInfoTypes";
import ProfileInfo from "./profileOverview/ProfileInfo";
import ProfileRelation from "./profileOverview/ProfileRelation";
import ProfileOverviewSkeleton from "./skeleton/ProfileOverviewSkeleton";

interface IProfileOverview {
  user?: IUser;
}

function ProfileOverview({ user }: IProfileOverview) {
  return (
    <Layout>
      {user ? (
        <>
          <ProfileInfo user={user} />
          <ProfileRelation user={user} />
        </>
      ) : (
        <ProfileOverviewSkeleton />
      )}
    </Layout>
  );
}

const Layout = styled.div`
  padding: var(--gap-3) 0;
  display: flex;
  flex-direction: column;
`;

export default ProfileOverview;
