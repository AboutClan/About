import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import Slide from "../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import NotCompletedModal from "../../modals/system/NotCompletedModal";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import { DispatchType } from "../../types/hooks/reactTypes";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
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

  const tabParam = searchParams.get("tab");
  const locationParam = searchParams.get("location") as LocationEn;
  const dateParam = searchParams.get("date");

  const setSlideDirection = useSetRecoilState(slideDirectionState);

  console.log("tab", tabParam);
  useEffect(() => {
    if (!session?.user) return;
    console.log("tt");
    if ((tabParam === "study" || !tabParam) && (!locationParam || !dateParam)) {
      console.log("52", tabParam, locationParam, dateParam);
      setCategory("스터디");
      const initialUrl = getUrlWithLocationAndDate(locationParam, dateParam, session.user.location);
      console.log("53", initialUrl);
      router.replace(initialUrl);
    }
    if (tabParam === "gather") {
      setCategory("모임");
      console.log(42, locationParam);
      if (!locationParam) {
        console.log(
          53,
          locationParam || convertLocationLangTo(session?.user.location || "suw", "en"),
          session?.user,
        );
        router.replace(
          `/home?tab=gather&location=${locationParam || convertLocationLangTo(session.user.location || "suw", "en")}`,
        );
      }
    }
  }, [session?.user, locationParam, dateParam, tabParam]);

  const [isNotCompletedModal, setIsNotCompletedModal] = useState(false);

  const handleTabMove = (tab: "스터디" | "모임") => {
    if (tab === "스터디") {
      const initialUrl = getUrlWithLocationAndDate(locationParam, dateParam, session.user.location);
      router.replace(initialUrl);
    }
    if (tab === "모임") {
      console.log(24);
      router.replace(
        `/home?tab=gather&location=${locationParam || convertLocationLangTo(session?.user.location || "suw", "en")}`,
      );
    }

    setCategory(tab);
  };

  const onClickStudy = () => {
    setSlideDirection("left");
    handleTabMove("스터디");
  };

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "스터디",
      func: onClickStudy,
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
