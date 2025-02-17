import { Box } from "@chakra-ui/react";
import { useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import TabNav from "../../components/molecules/navs/TabNav";
import { useUserInfoQuery } from "../../hooks/user/queries";
import UserGatherSection from "../../pageTemplates/user/UserGatherSection";
import UserGroupSection from "../../pageTemplates/user/UserGroupSection";
import UserHeader from "../../pageTemplates/user/UserHeader2";
import UserLogSection from "../../pageTemplates/user/UserLogSection";
import UserProfileSection from "../../pageTemplates/user/UserProfileSection";

function UserPage() {
  const { data: user } = useUserInfoQuery();

  const [section, setSection] = useState<"profile" | "gather" | "group" | "billing">("profile");

  return (
    <>
      <UserHeader />
      <Slide isNoPadding>
        <Box borderBottom="var(--border)" px={5} mb={5}>
          <TabNav
            tabOptionsArr={[
              { text: "프로필", func: () => setSection("profile") },
              { text: "모임 내역", func: () => setSection("gather") },
              { text: "소모임 내역", func: () => setSection("group") },
              { text: "정산 내역", func: () => setSection("billing") },
            ]}
            isBlack
            isMain
            isFullSize
          />
        </Box>
      </Slide>
      {user && (
        <>
          <Slide isNoPadding>
            {section === "profile" ? (
              <UserProfileSection user={user} />
            ) : section === "gather" ? (
              <UserGatherSection />
            ) : section === "group" ? (
              <UserGroupSection />
            ) : (
              <UserLogSection />
            )}
          </Slide>
        </>
      )}
    </>
  );
}

export default UserPage;
