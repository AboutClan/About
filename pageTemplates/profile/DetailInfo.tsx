import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import BlurredPart from "../../components/molecules/BlurredPart";
import { PLACE_TO_NAME } from "../../constants/serviceConstants/studyConstants/studyCafeNameConstants";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../utils/convertUtils/convertTypes";

function DetailInfo({ user, groups }: { user: IUser; groups: string[] }) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const isPrivate =
    user?.isPrivate && !user?.friend.includes(session?.user.uid) && user?.uid !== session?.user.uid;

  return (
    <Layout>
      <BlurredPart
        isBlur={isGuest || isPrivate}
        text={isPrivate ? "프로필 비공개 (친구에게만 공개)" : undefined}
      >
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
            <span>소모임</span>
            <Box
              flex={1}
              fontWeight={600}
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2, // 최대 2줄
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {groups?.map((group, idx) => (
                <>
                  <span>{group}</span>
                  <span>{idx !== groups.length - 1 && ", "}</span>
                </>
              ))}
            </Box>
          </ProfileItem>
          <ProfileItem>
            <span>즐겨찾기</span>
            <span>{PLACE_TO_NAME[user?.studyPreference?.place] || "없음"}</span>
          </ProfileItem>
        </Profile>
      </BlurredPart>
      {/* <Chart type="study" user={user} /> */}
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
