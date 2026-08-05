import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { HOME_ACTIVITY_INTRO_POPUP_AT } from "../../constants/keys/localStorage";
import { MODAL_QUEUE_PRIORITY } from "../../constants/modalQueuePriority";
import { useOpenHomeActivityDrawer } from "../../hooks/custom/useHomeActivityDrawer";
import { useSingleModalSlot } from "../../hooks/custom/useSingleModalSlot";
import { ModalLayout } from "../../modals/Modals";
import { hasShownHomeAutoPopupState } from "../../recoils/modalQueueRecoils";
import { transferHomeActivityDrawerOpenState } from "../../recoils/transferRecoils";

const POPUP_RE_SHOW_GAP_DAY = 7;

// 홈 화면 첫 진입 시(또는 마지막 노출 후 7일 경과 시) 한 번 뜨는 작은 안내 모달.
// "소모임 둘러보기"를 누르면 HomeActivityDrawer(Layout에 전역 마운트)가 라우터 쿼리를 통해 열린다.
function HomeActivityIntroPopup() {
  const [shouldShowIntro, setShouldShowIntro] = useState(false);
  const openHomeActivityDrawer = useOpenHomeActivityDrawer();
  // Drawer가 이미 열려있는 상태로 이 화면에 진입했다면(예: /support/[id]에서 뒤로가기)
  // 인트로 팝업이 Drawer와 동시에 뜨지 않도록 막는다.
  const isActivityDrawerOpen = useRecoilValue(transferHomeActivityDrawerOpenState);
  // 이 팝업이 뜨면 HomeInitialSetting의 나머지 체인이 뒤이어 뜨지 못하도록 켜두는 전역
  // 플래그. 강제 업데이트를 빼면 이 팝업이 최우선이라, 이 팝업 자신은 이 플래그를 확인할
  // 필요가 없다(확인하면 뜨자마자 스스로 플래그를 켜고 그 즉시 자기 조건도 거짓이 되어
  // 숨어버리는 자기파괴적 버그가 된다). 설정(set)만 하고 읽지는 않는다.
  const setHasShownHomeAutoPopup = useSetRecoilState(hasShownHomeAutoPopupState);

  useEffect(() => {
    if (isActivityDrawerOpen) return;

    const lastShownAt = localStorage.getItem(HOME_ACTIVITY_INTRO_POPUP_AT);
    const shouldShow =
      !lastShownAt || dayjs().diff(dayjs(lastShownAt), "day") >= POPUP_RE_SHOW_GAP_DAY;
    setShouldShowIntro(shouldShow);
  }, [isActivityDrawerOpen]);

  const markShown = () => {
    localStorage.setItem(HOME_ACTIVITY_INTRO_POPUP_AT, dayjs().toISOString());
  };

  const handleDismiss = () => {
    markShown();
    setShouldShowIntro(false);
  };

  const handleExplore = () => {
    markShown();
    setShouldShowIntro(false);
    openHomeActivityDrawer("activity");
  };

  // 강제 업데이트를 제외하면 이 팝업이 최우선이다. HomeInitialSetting이 관리하는 나머지
  // 팝업들(유저 설정 팝업들, 앱 설치 유도)과 동시에 뜨지 않도록 전역 대기열에 후보로 등록한다.
  const isActive = useSingleModalSlot(
    "homeActivityIntro",
    MODAL_QUEUE_PRIORITY.homeActivityIntro,
    shouldShowIntro && !isActivityDrawerOpen,
  );

  // 이 팝업이 실제로 뜨면, 같은 방문에서 HomeInitialSetting의 나머지 체인이 뒤이어 뜨지
  // 못하도록 전역 플래그를 켠다(닫아도 꺼지지 않음. 초기화는 HomeInitialSetting 언마운트 때).
  useEffect(() => {
    if (isActive) setHasShownHomeAutoPopup(true);
  }, [isActive, setHasShownHomeAutoPopup]);

  if (!isActive) return null;

  return (
    <ModalLayout
      title="내 취향의 소모임 찾기!"
      setIsModal={handleDismiss}
      footerOptions={{
        main: { text: "소모임 둘러보기", func: handleExplore },
        sub: { text: "나중에", func: handleDismiss },
      }}
      paddingOptions={{ body: { top: 4 } }}
    >
      <Box mx="auto" pos="relative" w="100%" aspectRatio={1 / 1} borderRadius="12px" overflow="hidden">
        <Image
          src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/KakaoTalk_20250519_213830485.jpg"
          fill
          sizes="300px"
          alt="image"
        />
      </Box>
      <Box mt={5} fontSize="14px">
        취향에 맞는 모임을 찾고 있나요? <br />
        참여 가능한 소모임을 한 번에 둘러보세요!
      </Box>
    </ModalLayout>
  );
}

export default HomeActivityIntroPopup;
