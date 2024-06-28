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

export type HomeTab = "스터디" | "모임" | "동아리" | "기타";

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
    gather: "모임",
    club: "동아리",
    temp: "기타",
  };

  useEffect(() => {
    if (!session?.user) return;
    if (!category) setCategory(matchParam[tabParam]);
    if ((tabParam === "study" || !tabParam) && (!locationParam || !dateParam)) {
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
    if (tab === "모임") {
      router.replace(
        `/home?tab=gather&location=${locationParam || convertLocationLangTo(session?.user.location || "suw", "en")}`,
      );
    }
    if (tab === "기타") {
      router.replace(`/home?tab=temp`);
    }
    if (tab === "동아리") {
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
      text: "스터디",
      func: onClickStudy,
      flex: 1,
    },
    {
      text: "모임",
      func: () => handleTabMove("모임"),
      flex: 1,
    },
    {
      text: "동아리",
      func: () => handleTabMove("동아리"),
      flex: 1,
    },
    {
      text: "기타",
      func: () => handleTabMove("기타"),
      flex: 1,
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
