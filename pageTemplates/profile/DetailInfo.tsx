import { useSession } from "next-auth/react";
import styled from "styled-components";

import BlurredPart from "../../components/molecules/BlurredPart";
import Chart from "../../components/organisms/chart/Chart";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../utils/convertUtils/convertTypes";

function DetailInfo({ user }: { user: IUser }) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  return (
    <Layout>
      <BlurredPart isBlur={isGuest}>
        <Profile>
          <ProfileItem>
            <span>나이</span>
            <span> {birthToAge(user?.birth)}</span>
          </ProfileItem>
          <ProfileItem>
            <span>성별</span>
            <span> {user?.gender}</span>
          </ProfileItem>
          <ProfileItem>
            <span>MBTI</span>
            {user?.mbti ? <span>{user?.mbti}</span> : <span>--</span>}
          </ProfileItem>
          <ProfileItem>
            <span>지역</span>
            <span> {user?.location}</span>
          </ProfileItem>
          <ProfileItem>
            <span>전공</span>
            {user?.majors?.length ? <span>{user?.majors[0]?.detail}</span> : <span>--</span>}
          </ProfileItem>
          <ProfileItem>
            <span>관심사</span>
            <div>
              {user?.interests?.first ? (
                <Interests>
                  <span>1. {user?.interests.first}</span>
                  <span>
                    {user?.interests.second && "2."} {user?.interests.second}
                  </span>
                </Interests>
              ) : (
                <span>--</span>
              )}
            </div>
          </ProfileItem>
        </Profile>
      </BlurredPart>
      <Chart type="study" user={user} />
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 var(--gap-4);
  padding: var(--gap-3) 0;
`;

const Profile = styled.div`
  padding: 0 var(--gap-1);
  margin-bottom: var(--gap-1);
  display: flex;
  flex-direction: column;
  line-height: 2.4;
`;

const Interests = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--gray-800);
  font-weight: 600;

  > span {
    display: inline-block;
  }
`;

const ProfileItem = styled.div`
  display: flex;
  > span:first-child {
    display: inline-block;
    width: 64px;
    color: var(--gray-600);
  }
  > span:last-child {
    color: var(--gray-800);
    font-weight: 600;
  }
`;

export default DetailInfo;
