import { Box } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import ControlButton from "@/components/ControlButton";
import { ThunderIcon, Writing2Icon } from "@/components/Icons/ControlButtonIcon";
import Slide from "@/components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "@/components/molecules/navs/TabNav";
import GatherPickModal from "@/features/gather/modals/GatherPickModal";
import GatherHeader from "@/features/gather/screens/GatherHeader";
import GatherMain from "@/features/gather/screens/GatherMain";
import GatherPick from "@/features/gather/screens/GatherPick";
import { sharedGatherWritingState, transferGatherDataState } from "@/features/gather/state";
import SquareLoungeSection from "@/features/square/screens/SquareLoungeSection";
import { useToast } from "@/hooks/custom/CustomToast";

export default function GatherLandingScreen() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const tabParam = searchParams.get("tab");
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";

  const setTrasnferGatherData = useSetRecoilState(transferGatherDataState);
  const setTransferGatherWriting = useSetRecoilState(sharedGatherWritingState);
  // const [isModal, setIsModal] = useState(false);
  const [tab, setTab] = useState<"번개" | "라운지" | "이런 번개 어때요?">("번개");
  const [isGatherPickModal, setIsGatherPickModal] = useState(false);

  useEffect(() => {
    setTrasnferGatherData(null);
    setTransferGatherWriting(null);
    // if (!checkAndSetLocalStorage("gatherGuidePopUp", 21)) {
    //   setIsModal(true);
    // }
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
        newSearchParams.set("tab", "lounge");
        router.replace("gather" + "?" + newSearchParams.toString());
        setTab("라운지");
      },
    },
    {
      text: "이런 번개 어때요?",
      func: () => {
        newSearchParams.set("tab", "gatherPick");
        router.replace("gather" + "?" + newSearchParams.toString());
        setTab("이런 번개 어때요?");
      },
    },
  ];

  return (
    <>
      <GatherHeader tab={tab} />
      <Slide isNoPadding>
        <Box fontSize="16px" mb={3} bgColor="white" borderBottom="var(--border)" px={5}>
          <TabNav tabOptionsArr={tabNavOptions} selected={tab} isBlack />
        </Box>
      </Slide>
      <Slide isNoPadding={tab !== "번개"}>
        {tab === "번개" ? (
          <GatherMain />
        ) : tab === "라운지" ? (
          <SquareLoungeSection />
        ) : (
          <GatherPick />
        )}
      </Slide>

      {!isGuest && (
        <ControlButton
          text={tab === "번개" ? "모임 개설" : tab === "라운지" ? "후기 작성" : "모임 제안"}
          rightIcon={
            tab === "번개" ? (
              <ThunderIcon />
            ) : tab === "라운지" ? (
              <Writing2Icon />
            ) : (
              <Writing2Icon />
            )
          }
          hasBottomNav
          handleClick={() => {
            if (tab === "번개") {
              router.push("/gather/writing/category");
            } else if (tab === "이런 번개 어때요?") {
              setIsGatherPickModal(true);
            } else {
              toast(
                "info",
                "준비중인 기능입니다. 모임 상세페이지에서도 후기를 작성할 수 있습니다!",
              );
            }
          }}
          isDisabled={isGuest}
        />
      )}
      {/*       
      {!isGuest && tab === "번개" && (
        <WritingButton url="/gather/writing/category" type="thunder" />
      )}
      {!isGuest && tab === "이런 번개 어때요?" && (
        <WritingButton onClick={() => setIsGatherPickModal(true)} />
      )} */}
      {/* {isModal && (
        <PageGuideModal title="번개 가이드" footerOptions={{}} setIsModal={setIsModal}>
          다양한 번개 모임에 참여해 보세요! 금방 마감될지도 모른다구요? 개설시에는 최대{" "}
          <b>15,000원</b> 지원금 획득! 참여 승인제 및 다양한 기능이 있습니다!
        </PageGuideModal>
      )} */}
      {isGatherPickModal && <GatherPickModal setIsModal={setIsGatherPickModal} />}
    </>
  );
}
