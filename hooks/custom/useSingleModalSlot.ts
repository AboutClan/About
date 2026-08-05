import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { modalQueueState } from "../../recoils/modalQueueRecoils";

// 화면 진입 시 자동으로 뜨는 팝업/모달들이 한 번에 하나만 보이도록 조정하는 훅.
//
// 각 팝업 컴포넌트는 "이 팝업을 지금 띄우고 싶다"는 조건(shouldShow)은 그대로 기존 로직으로
// 계산하고, 실제로 화면에 그릴지는 이 훅이 반환하는 값으로 결정한다. 여러 컴포넌트가 동시에
// shouldShow=true여도, priority(작을수록 우선) 값이 가장 작은 후보 하나만 true를 받는다.
//
// id는 앱 전체에서 유일해야 하며, priority는 관련 팝업들 사이에서 한곳(예: 이 파일 상단 주석)에
// 모아 관리하는 것을 권장한다.
export function useSingleModalSlot(id: string, priority: number, shouldShow: boolean): boolean {
  const setQueue = useSetRecoilState(modalQueueState);
  const queue = useRecoilValue(modalQueueState);

  useEffect(() => {
    if (!shouldShow) {
      setQueue((prev) => prev.filter((candidate) => candidate.id !== id));
      return;
    }

    setQueue((prev) =>
      prev.some((candidate) => candidate.id === id) ? prev : [...prev, { id, priority }],
    );

    return () => {
      setQueue((prev) => prev.filter((candidate) => candidate.id !== id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, priority, shouldShow]);

  if (!shouldShow) return false;

  const winner = queue.reduce<{ id: string; priority: number } | null>(
    (best, candidate) => (!best || candidate.priority < best.priority ? candidate : best),
    null,
  );

  return winner?.id === id;
}
