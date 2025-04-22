import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import WritingButton from "../../components/atoms/buttons/WritingButton";
import Slide from "../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import PageGuideModal from "../../modals/PageGuideModal";
import GatherHeader from "../../pageTemplates/gather/GatherHeader";
import GatherMain from "../../pageTemplates/gather/GatherMain";
import SquareLoungeSection from "../../pageTemplates/square/SquareLoungeSection";
import { sharedGatherWritingState } from "../../recoils/sharedDataAtoms";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { checkAndSetLocalStorage } from "../../utils/storageUtils";

function Gather() {
  const typeToast = useTypeToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const tabParam = searchParams.get("tab");
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";

  const setTrasnferGatherData = useSetRecoilState(transferGatherDataState);
  const setTransferGatherWriting = useSetRecoilState(sharedGatherWritingState);
  const [isModal, setIsModal] = useState(false);
  const [tab, setTab] = useState<"번개" | "라운지">("번개");

  useEffect(() => {
    setTrasnferGatherData(null);
    setTransferGatherWriting(null);
    if (!checkAndSetLocalStorage("gatherGuidePopUp", 21)) {
      setIsModal(true);
    }
  }, []);

  useEffect(() => {
    if (tabParam === "gather") setTab("번개");
    if (tabParam === "lounge") setTab("라운지");
  }, [tabParam]);

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "번개",
      func: () => {
        newSearchParams.set("tab", "gather");
        router.replace("gather" + "?" + newSearchParams.toString());
        setTab("번개");
      },
    },
    {
      text: "라운지",
      func: () => {
        typeToast("inspection");
        return;
        newSearchParams.set("tab", "lounge");
        router.replace("gather" + "?" + newSearchParams.toString());
        setTab("라운지");
      },
    },
  ];

  return (
    <>
      <GatherHeader />
      <Slide isNoPadding>
        <Box fontSize="16px" mb={3} bgColor="white">
          <TabNav tabOptionsArr={tabNavOptions} selected={tab} isFullSize />
        </Box>
      </Slide>

      {tab === "번개" ? <GatherMain /> : <SquareLoungeSection />}
      {!isGuest && <WritingButton url="/gather/writing/category" type="thunder" />}
      {isModal && (
        <PageGuideModal title="번개 가이드" footerOptions={{}} setIsModal={setIsModal}>
          다양한 번개 모임에 참여해 보세요! 금방 마감될지도 모른다구요? 개설시에는 최대{" "}
          <b>15,000원</b> 지원금 획득! 참여 승인제 및 다양한 기능이 있습니다!
        </PageGuideModal>
      )}
    </>
  );
}

export default Gather;
