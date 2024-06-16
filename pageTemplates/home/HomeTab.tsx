import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Slide from "../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import NotCompletedModal from "../../modals/system/NotCompletedModal";
import { DispatchType } from "../../types/hooks/reactTypes";
import { LocationEn } from "../../types/services/locationTypes";
import { getUrlWithLocationAndDate } from "../../utils/convertUtils/convertTypes";

export type HomeTab = "스터디" | "모임";

interface HomeTabProps {
  tab: HomeTab;
  setTab: DispatchType<HomeTab>;
}

function HomeTab({ tab: category, setTab: setCategory }: HomeTabProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");
  const locationParam = searchParams.get("location") as LocationEn;
  const dateParam = searchParams.get("date");

  useEffect(() => {
    if ((tab === "study" || !tab) && session?.user && (!locationParam || !dateParam)) {
      const initialUrl = getUrlWithLocationAndDate(locationParam, dateParam, session.user.location);
      router.replace(initialUrl);
    }
    if (tab === "gather" && category !== "모임") {
      setCategory("모임");
    }
  }, [session?.user, locationParam, dateParam]);

  const [isNotCompletedModal, setIsNotCompletedModal] = useState(false);

  const handleTabMove = (tab: "스터디" | "모임") => {
    if (tab === "스터디") {
      const initialUrl = getUrlWithLocationAndDate(locationParam, dateParam, session.user.location);
      router.replace(initialUrl);
    }
    if (tab === "모임") {
      router.replace("/home?tab=gather");
    }

    setCategory(tab);
  };

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "스터디",
      func: () => handleTabMove("스터디"),
    },
    {
      text: "모임",
      func: () => handleTabMove("모임"),
    },
  ];

  return (
    <>
      <Slide>
        <Box fontSize="16px" bgColor="white" pt="8px">
          <TabNav tabOptionsArr={tabNavOptions} selected={category} hasBorder={false} />
        </Box>
      </Slide>
      {isNotCompletedModal && <NotCompletedModal setIsModal={setIsNotCompletedModal} />}
    </>
  );
}

export default HomeTab;
