import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import Slide from "../../components/layouts/PageSlide";
import { useUserInfoQuery } from "../../hooks/user/queries";
import UserCollection from "../../pageTemplates/user/userCollection";
import UserHeader from "../../pageTemplates/user/userHeader";
import UserOverview from "../../pageTemplates/user/userOverview/UserOverView";
import UserPointBlock from "../../pageTemplates/user/UserPointBlock";
import UserProfile from "../../pageTemplates/user/userProfile";
import { IUser } from "../../types/models/userTypes/userInfoTypes";

function UserInfo() {
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";

  const { data: user } = useUserInfoQuery({});

  const userInfo = isGuest
    ? {
        point: 0,
        role: "guest",
        deposit: 0,
        friend: [],
        like: 0,

        monthScore: 0,
        birth: "000000",
        comment: "어바웃 동아리 멤버 모집중!",
        isActive: true,
        location: "수원",
        name: "게스트",
        score: 0,

        profileImage:
          "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EB%B0%94%ED%83%80+%EC%95%84%EC%9D%B4%EC%BD%98/%EB%B3%91%EC%95%84%EB%A6%AC.webp",
      }
    : user;

  return (
    <>
      <UserHeader />
      <Slide>
        {userInfo && (
          <>
            <UserOverview userInfo={userInfo as unknown as IUser} />
            <UserPointBlock />
            <Box
              pt="4px"
              pb="16px"
              mb="40px"
              bgColor="white"
              mx="16px"
              border="var(--border-main)"
              rounded="var(--rounded-lg)"
            >
              <UserProfile />
              <UserCollection />
            </Box>
          </>
        )}
      </Slide>
    </>
  );
}

export default UserInfo;
