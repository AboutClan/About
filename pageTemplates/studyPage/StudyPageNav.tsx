import { Flex } from "@chakra-ui/react";
import TabNav from "../../components/molecules/navs/TabNav";
import { DispatchType } from "../../types/hooks/reactTypes";

export type StudyTab = "스터디 참여" | "카공 지도";

interface StudyPageNavProps {
  tab: StudyTab;
  setTab: DispatchType<StudyTab>;
}

function StudyPageNav({ tab, setTab }: StudyPageNavProps) {
  return (
    <>
      <Flex borderBottom="var(--border)" px={5} mt={1}>
        <TabNav
          tabOptionsArr={[
            { text: "스터디 참여", func: () => setTab("스터디 참여") },
            { text: "카공 지도", func: () => setTab("카공 지도") },
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
