import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import TabNav from "../../components/molecules/navs/TabNav";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../hooks/user/queries";
import UserGatherSection from "../../pageTemplates/user/UserGatherSection";
import UserGroupSection from "../../pageTemplates/user/UserGroupSection";
import UserHeader from "../../pageTemplates/user/UserHeader2";
import UserLogSection from "../../pageTemplates/user/UserLogSection";
import UserProfileSection from "../../pageTemplates/user/UserProfileSection";

function UserPage() {
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";
  const { data: user } = useUserInfoQuery();
  const typeToast = useTypeToast();
  const [section, setSection] = useState<"profile" | "gather" | "group" | "billing">("profile");

  const handleClickTab = (type: "profile" | "gather" | "group" | "billing") => {
    if (isGuest) {
      typeToast("guest");
      return;
    }

    setSection(type);
  };

  return (
    <>
      <UserHeader />
      <Slide isNoPadding>
        <Box borderBottom="var(--border)" px={5} mb={5}>
          <TabNav
            tabOptionsArr={[
              { text: "프로필", func: () => handleClickTab("profile") },
              { text: "모임 내역", func: () => handleClickTab("gather") },
              { text: "소모임 내역", func: () => handleClickTab("group") },
              { text: "정산 내역", func: () => handleClickTab("billing") },
            ]}
            isBlack
            isMain
            isFullSize
          />
        </Box>
      </Slide>
      <Slide isNoPadding>
        {user && (
          <>
            {section === "profile" ? (
              <UserProfileSection user={user} />
            ) : section === "gather" ? (
              <UserGatherSection />
            ) : section === "group" ? (
              <UserGroupSection />
            ) : (
              <UserLogSection />
            )}
          </>
        )}
      </Slide>
    </>
  );
}

export default UserPage;
