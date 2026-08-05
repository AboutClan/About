// useSingleModalSlot()에 등록하는, 서로 다른 컴포넌트 트리에서 뜨는 자동 팝업들의
// 우선순위(작을수록 먼저 노출). 새 자동 팝업을 추가할 때는 이 목록에 추가하고, 값이 이미
// 있는 것들과 겹치지 않게 관리한다.
//
// 순서: 강제 업데이트(예외, 항상 최우선) > 소모임 둘러보기 안내 > 유저 설정 팝업들/앱 설치
// 유도(HomeInitialSetting의 나머지 체인) > 소모임/제휴 혜택 Drawer.
// 강제 업데이트만 예외적으로 최우선이고, 그 외에는 homeActivityIntro가 homePopups보다
// 먼저다: homeActivityIntro가 뜨기로 결정되면 그 방문에서 homePopups 체인은 뜨지 않는다
// (pageTemplates/home/HomeInitialSetting.tsx의 hasShownHomeAutoPopupState 참고).
export const MODAL_QUEUE_PRIORITY = {
  homeForceUpdate: 0, // 강제 업데이트 — 유일한 예외, 항상 최우선
  homeActivityIntro: 5, // 소모임 둘러보기 안내
  homePopups: 10, // pageTemplates/home/HomeInitialSetting.tsx — 유저 설정 팝업들/앱 설치 유도 체인(강제 업데이트 제외)
  homeActivityDrawer: 15, // 소모임/제휴 혜택 Drawer
} as const;
