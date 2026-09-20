import { useEffect, useRef } from "react";

// 안드로이드 하드웨어 뒤로가기(네이티브 → Layout의 backAction 메시지)로 오버레이를 닫기 위한 스택.
//
// 이 프로젝트에는 오버레이를 여는 방식이 두 가지 있다.
//  1) useOverlayRouter의 updateQuery로 ?modal=... 을 히스토리에 쌓는 방식(지도 드로어 등).
//     이쪽은 Layout이 router.back()만 불러주면 쿼리가 빠지면서 알아서 닫히므로 여기 등록할 필요가 없다.
//  2) 로컬 useState만으로 여닫는 방식(카공지도 팝업들, 마이페이지 드로어 등).
//     이쪽은 히스토리에 흔적이 없어 router.back()을 부르면 오버레이가 아니라 "페이지"가 뒤로 간다.
//     그런 오버레이가 이 스택에 자신을 등록해두고, Layout이 뒤로가기를 받으면 가장 나중에 열린
//     것부터(LIFO) 닫는다.
//
// 스택에서 빼는 일은 runTopBackGuard가 직접 하지 않는다. onBack이 상태를 내려 isActive가 false가
// 되면 아래 useEffect의 cleanup이 제거하므로, "열려 있는가"의 단일 기준은 항상 호출부 상태다.
type BackGuardEntry = {
  id: number;
  onBack: () => void;
};

const backGuardStack: BackGuardEntry[] = [];
let nextBackGuardId = 0;

// 가장 위(가장 최근에 열린) 오버레이를 닫는다. 닫을 게 있었으면 true —
// 호출부(Layout)는 true면 페이지 뒤로가기를 수행하지 않는다.
export const runTopBackGuard = (): boolean => {
  const top = backGuardStack[backGuardStack.length - 1];
  if (!top) return false;

  top.onBack();
  return true;
};

export const useBackGuard = (isActive: boolean, onBack: () => void) => {
  // onBack이 렌더마다 새 함수로 만들어져도 등록/해제가 반복되지 않도록 ref로만 참조한다.
  // (등록/해제가 반복되면 스택 순서가 뒤집혀 엉뚱한 오버레이가 먼저 닫힐 수 있다.)
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!isActive) return;

    const entry: BackGuardEntry = {
      id: nextBackGuardId++,
      onBack: () => onBackRef.current(),
    };
    backGuardStack.push(entry);

    return () => {
      const index = backGuardStack.findIndex((item) => item.id === entry.id);
      if (index !== -1) backGuardStack.splice(index, 1);
    };
  }, [isActive]);
};
