import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";

import {
  HOME_ACTIVITY_DRAWER_QUERY_KEY,
  HomeActivityDrawerTab,
  transferHomeActivityDrawerOpenState,
  transferHomeActivityDrawerTabState,
} from "../../recoils/transferRecoils";

// HomeActivityDrawer를 여는 모든 진입점에서 공용으로 사용한다.
// 라우터 쿼리에 열림 상태를 실어 히스토리에 남기므로, 뒤로가기를 누르면 자연스럽게 Drawer가 닫힌다.
export function useOpenHomeActivityDrawer() {
  const router = useRouter();
  const setIsOpen = useSetRecoilState(transferHomeActivityDrawerOpenState);
  const setTab = useSetRecoilState(transferHomeActivityDrawerTabState);

  return (tab: HomeActivityDrawerTab = "activity") => {
    setTab(tab);
    setIsOpen(true);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, [HOME_ACTIVITY_DRAWER_QUERY_KEY]: tab },
      },
      undefined,
      { shallow: true },
    );
  };
}
