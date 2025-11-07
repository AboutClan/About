import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import TabNav from "../../components/molecules/navs/TabNav";
import { GATHER_REVIEW_RECEIVE, GATHER_REVIEW_WRITE } from "../../constants/keys/localStorage";
import { useFeedCntQuery } from "../../hooks/feed/queries";
import { useUserInfoQuery } from "../../hooks/user/queries";
import UserGatherSection from "../../pageTemplates/user/UserGatherSection";
import UserGroupSection from "../../pageTemplates/user/UserGroupSection";
import UserHeader from "../../pageTemplates/user/UserHeader2";
import UserLogSection from "../../pageTemplates/user/UserLogSection";
import UserProfileSection from "../../pageTemplates/user/UserProfileSection";

type Tab = "profile" | "gather" | "group";

function UserPage() {
  const router = useRouter();
  const tabParam = router.query.tab as Tab;
  const { data: user } = useUserInfoQuery();
  const [section, setSection] = useState<Tab>("profile");
  const [isAlert, setIsAlert] = useState(false);

  const { data: feeds } = useFeedCntQuery();

  useEffect(() => {
    if (!tabParam) return;
    setSection(tabParam);
  }, [tabParam]);

  const handleClickTab = (type: Tab) => {
    setSection(type);
  };

  useEffect(() => {
    if (!feeds) return;

    const feedSumWriteSave = localStorage.getItem(GATHER_REVIEW_WRITE);
    const feedSumReceiveSave = localStorage.getItem(GATHER_REVIEW_RECEIVE);
    if (
      (feeds?.reviewReceived !== 0 || feeds?.writtenReviewCnt !== 0) &&
      (feeds?.reviewReceived !== +feedSumReceiveSave ||
        feeds?.writtenReviewCnt !== +feedSumWriteSave)
    ) {
      setIsAlert(true);
    }
  }, [feeds]);

  return (
    <>
      <UserHeader />
      <Slide isNoPadding>
        <Box borderBottom="var(--border)" px={5} mb={5}>
          <TabNav
            selected={
              section === "profile"
                ? "프로필"
                : section === "gather"
                ? "내가 참여한 모임"
                : "소모임"
            }
            tabOptionsArr={[
              {
                text: "프로필",
                func: () => {
                  router.replace(`/user?tab=profile`);
                  handleClickTab("profile");
                },
              },
              {
                text: "내가 참여한 모임",
                func: () => {
                  router.replace(`/user?tab=gather`);
                  handleClickTab("gather");
                  setIsAlert(false);
                },
                isAlert,
              },
              {
                text: "소모임",
                func: () => {
                  router.replace(`/user?tab=group`);
                  handleClickTab("group");
                },
              },
            ]}
            isBlack
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
        <Box h={10} />
      </Slide>
    </>
  );
}

export default UserPage;
