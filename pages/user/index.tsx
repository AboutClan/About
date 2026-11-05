import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Slide from "@/components/layouts/PageSlide";
import HomeActivityDrawer from "@/components/overlay/HomeActivityDrawer";
import { useUserInfoQuery } from "@/features/user/hooks/queries";
import UserHeader from "@/features/user/screens/UserHeader2";
import UserProfileSection from "@/features/user/screens/UserProfileSection";

// 예전 탭 링크(/user?tab=gather 등)는 각 하위 페이지로 보낸다
const LEGACY_TAB_PATH: Record<string, string> = {
  group: "/user/group",
  gather: "/user/gather",
  study: "/user/study",
};

function UserPage() {
  const router = useRouter();
  const tabParam = router.query.tab as string;
  const { data: user } = useUserInfoQuery();

  useEffect(() => {
    const path = LEGACY_TAB_PATH[tabParam];
    if (path) router.replace(path);
  }, [tabParam]);

  return (
    <>
      <HomeActivityDrawer />
      <UserHeader />
      <Slide isNoPadding>
        {user && <UserProfileSection user={user} />}
        <Box h={10} />
      </Slide>
    </>
  );
}

export default UserPage;
