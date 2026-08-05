import { atom } from "recoil";

export interface ModalQueueCandidate {
  id: string;
  // 값이 작을수록 먼저(우선) 노출된다.
  priority: number;
}

// 화면 진입 시 자동으로 뜨는 팝업/모달(강제 업데이트, 앱 설치 유도, 유저 설정 팝업들,
// 소모임 둘러보기 안내 등)이 동시에 여러 개 뜨는 것을 막기 위한 전역 대기열.
// 각 팝업은 useSingleModalSlot()으로 후보로만 등록하고, 실제 렌더링은 이 대기열에서
// priority가 가장 낮은(=가장 먼저 보여줄) 후보 하나만 결정한다.
export const modalQueueState = atom<ModalQueueCandidate[]>({
  key: "modalQueueState",
  default: [],
});

// /home 방문 중 "자동으로 뜨는 팝업"(HomeInitialSetting의 홈 팝업 체인, 소모임 둘러보기 안내)
// 중 하나가 이미 노출되기로 결정됐는지 여부. 한 번 true가 되면 그 팝업을 닫아도 다시 false로
// 돌아가지 않아, 같은 방문에서 다른 자동 팝업이 뒤이어 뜨는 일을 막는다.
// (사용자가 직접 클릭해서 여는 HomeActivityDrawer는 이 배타 처리 대상이 아니다.)
export const hasShownHomeAutoPopupState = atom<boolean>({
  key: "hasShownHomeAutoPopupState",
  default: false,
});
