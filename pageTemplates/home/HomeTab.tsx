import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import NotCompletedModal from "../../modals/system/NotCompletedModal";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import { DispatchType } from "../../types/hooks/reactTypes";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { getUrlWithLocationAndDate } from "../../utils/convertUtils/convertTypes";

export type HomeTab = "추천" | "스터디" | "번개" | "캘린더";

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

  const matchParam = {
    study: "스터디",
    gather: "번개",
    club: "캘린더",
    recommendation: "추천",
  };

  useEffect(() => {
    if (!session?.user) return;
    if (!category) setCategory(matchParam[tabParam]);
    if (!tabParam) {
      router.replace("/home?tab=recommendation");
      return;
    }
    if (tabParam === "study" && (!locationParam || !dateParam)) {
      const initialUrl = getUrlWithLocationAndDate(locationParam, dateParam, session.user.location);
      router.replace(initialUrl);
    }
    if (tabParam === "gather" && !locationParam) {
      router.replace(
        `/home?tab=gather&location=${locationParam || convertLocationLangTo(session.user.location || "suw", "en")}`,
      );
    }
  }, [session?.user, locationParam, dateParam, tabParam]);

  const [isNotCompletedModal, setIsNotCompletedModal] = useState(false);

  const handleTabMove = (tab: HomeTab) => {
    if (tab === "스터디") {
      const initialUrl = getUrlWithLocationAndDate(locationParam, dateParam, session.user.location);
      router.replace(initialUrl);
    }
    if (tab === "번개") {
      router.replace(
        `/home?tab=gather&location=${locationParam || convertLocationLangTo(session?.user.location || "suw", "en")}`,
      );
    }
    if (tab === "추천") {
      router.replace(`/home?tab=recommendation`);
    }
    if (tab === "캘린더") {
      router.replace(`/home?tab=club`);
    }

    setCategory(tab);
  };

  const onClickStudy = () => {
    setSlideDirection("left");
    handleTabMove("스터디");
  };

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "추천",
      func: () => handleTabMove("추천"),
    },
    {
      text: "스터디",
      func: onClickStudy,
    },
    {
      text: "번개",
      func: () => handleTabMove("번개"),
    },
    {
      text: "캘린더",
      func: () => handleTabMove("캘린더"),
    },
  ];

  return (
    <>
      <>
        <Box fontSize="16px" bgColor="white" pt="8px">
          <TabNav tabOptionsArr={tabNavOptions} selected={category} hasBorder={false} />
        </Box>
      </>
      {isNotCompletedModal && <NotCompletedModal setIsModal={setIsNotCompletedModal} />}
    </>
  );
}

export default HomeTab;
