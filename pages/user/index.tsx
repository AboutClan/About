import { Box } from "@chakra-ui/react";

import Slide from "../../components/layouts/PageSlide";
import { useUserInfoQuery } from "../../hooks/user/queries";
import UserCollection from "../../pageTemplates/user/userCollection";
import UserHeader from "../../pageTemplates/user/userHeader";
import UserOverview from "../../pageTemplates/user/userOverview/UserOverView";
import UserPointBlock from "../../pageTemplates/user/UserPointBlock";
import UserProfile from "../../pageTemplates/user/userProfile";

function UserInfo() {
  const { data: userInfo } = useUserInfoQuery({});

  return (
    <>
      <UserHeader />
      <Slide>
        {userInfo && (
          <>
            <UserOverview />
            <UserPointBlock />
            <Box
              pt="4px"
              pb="16px"
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
