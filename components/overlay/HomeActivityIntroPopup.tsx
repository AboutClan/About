import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";

import { HOME_ACTIVITY_INTRO_POPUP_AT } from "../../constants/keys/localStorage";
import { useOpenHomeActivityDrawer } from "../../hooks/custom/useHomeActivityDrawer";
import { ModalLayout } from "../../modals/Modals";

const POPUP_RE_SHOW_GAP_DAY = 7;

// 홈 화면 첫 진입 시(또는 마지막 노출 후 7일 경과 시) 한 번 뜨는 작은 안내 모달.
// "소모임 둘러보기"를 누르면 HomeActivityDrawer(Layout에 전역 마운트)가 라우터 쿼리를 통해 열린다.
function HomeActivityIntroPopup() {
  const [shouldShowIntro, setShouldShowIntro] = useState(false);
  const openHomeActivityDrawer = useOpenHomeActivityDrawer();

  useEffect(() => {
    const lastShownAt = localStorage.getItem(HOME_ACTIVITY_INTRO_POPUP_AT);
    const shouldShow =
      !lastShownAt || dayjs().diff(dayjs(lastShownAt), "day") >= POPUP_RE_SHOW_GAP_DAY;
    setShouldShowIntro(shouldShow);
  }, []);

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

  if (!shouldShowIntro) return null;

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
