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
            { text: "About 스터디", func: () => changeTab("About 스터디") },
            { text: "카공 지도.ZIP 🔥", func: () => changeTab("카공 지도.ZIP 🔥") },
          ]}
          isBlack
          size="xl"
          isMain
        />
      </Flex>
    </>
  );
}

export default StudyPageNav;
