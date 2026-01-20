import { Flex } from "@chakra-ui/react";

import TabNav from "../../components/molecules/navs/TabNav";
import { StudyPageTab } from "../../pages/studyPage";

interface StudyPageNavProps {
  tab: StudyPageTab;
  changeTab: (tab: StudyPageTab) => void;
}

function StudyPageNav({ tab, changeTab }: StudyPageNavProps) {
  return (
    <>
      <Flex borderBottom="var(--border)" px={5} mt={1}>
        <TabNav
          selected={tab}
          tabOptionsArr={[
            { text: "스터디", func: () => changeTab("스터디") },
            { text: "랭킹", func: () => changeTab("카공 지도.ZIP 🔥") },
            { text: "챌린지", func: () => changeTab("카공 지도.ZIP 🔥") },
            { text: "카공 지도", func: () => changeTab("카공 지도.ZIP 🔥") },
          ]}
          isBlack
          isMain
          size="lg"
        />
      </Flex>
    </>
  );
}

export default StudyPageNav;
