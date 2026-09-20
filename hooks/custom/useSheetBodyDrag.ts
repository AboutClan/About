import { useCallback, useEffect, useRef } from "react";

// 바텀시트의 "본문 아무 데나 스와이프해도 핸들을 잡은 것처럼 움직이게" 하는 훅.
//
// 이 훅은 시트를 움직이지 않는다. 오직 "지금 이 터치가 목록 스크롤인가, 시트 드래그인가"만
// 판정하고, 시트 드래그로 확정되면 호출부가 이미 갖고 있는 드래그 엔진을 그대로 호출한다.
// BottomFlexDrawer(높이·2단계·고정 임계값)와 CafeListSheet(offset·3단계·속도) 는 모델이
// 달라서 엔진을 합치면 둘 다 망가진다. 반면 이 판정은 두 곳이 완전히 같고, 실기기에서
// 손봐야 하는 부분이라 한 곳에 모아 둔다.
//
// 왜 Pointer 가 아니라 Touch 이벤트인가:
//  - 일단 가로채기로 정한 뒤 브라우저의 네이티브 스크롤을 멈출 수 있는 수단은
//    preventDefault 뿐이다. touch-action 을 그때 바꿔 봐야 소용없고(제스처 시작 시점에
//    이미 확정된다), 스크롤러에 overflow:hidden 을 걸면 scrollTop 이 튄다.
//  - React 18 은 루트에 touchstart/touchmove 를 passive 로 등록하므로 JSX 의 onTouchMove
//    로는 preventDefault 를 할 수 없다. 그래서 노드에 직접 { passive: false } 로 붙인다.
//  - 덤으로, window 에 pointer 리스너를 붙이지 않으니 브라우저가 스크롤을 가져갈 때 오는
//    pointercancel 로 리스너가 남는 문제(= 이후 지도 드래그가 시트를 따라오는 증상)가
//    본문 경로에는 아예 생기지 않는다. 핸들은 기존 pointer 경로를 그대로 쓴다.
//    따라서 본문 드래그는 터치 전용이다 — 데스크톱 마우스는 핸들로만 끈다.

// 이 거리(px)를 넘어선 순간 스크롤이냐 드래그냐를 정한다.
//
// 브라우저는 1px 움직임부터 touchmove 를 보내지만 실제 스크롤은 플랫폼 터치 슬롭
// (Chrome/Android 기준 ~8px) 을 넘어야 시작하고, 그전까지 touchmove 는 cancelable 이다.
// 6px 에서 판정해야 그 창 안에 들어간다. 더 크게 잡으면 preventDefault 가 이미 먹지 않는다.
// (CafeListSheet 의 TAP_SLOP 과 같은 값 — 탭으로 볼지 말지의 경계와 일치시킨다.)
const DECIDE_SLOP = 6;

/** 세로 제스처를 자식이 직접 쓰는 영역이라는 표식. 휠 피커처럼 자체 드래그가 있는 곳에 붙인다. */
export const SHEET_NO_DRAG_ATTR = "data-sheet-no-drag";

export interface SheetBodyDragHandlers {
  /** 시트가 더 올라갈 여지가 있는가 (이미 최상단이면 false) */
  canDragUp: () => boolean;
  /** 시트가 더 내려갈 여지가 있는가 */
  canDragDown: () => boolean;
  /** 제스처를 시트 드래그로 확정한 시점. 여기서 드래그 원점을 다시 잡는다 */
  onDragStart: (clientY: number, timeStamp: number) => void;
  onDragMove: (clientY: number, timeStamp: number) => void;
  onDragEnd: (clientY: number, timeStamp: number) => void;
  onDragCancel: () => void;
  /** false 면 본문 드래그를 끈다 (기본 true) */
  enabled?: boolean;
}

type Phase = "idle" | "undecided" | "claimed" | "released";

/** StudyPageMap 의 스크롤 조상 탐색(pull-to-refresh 가드)과 같은 기준을 쓴다. */
const findScrollableAncestor = (
  from: HTMLElement | null,
  boundary: HTMLElement,
): HTMLElement | null => {
  let el: HTMLElement | null = from;
  while (el) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1) {
      return el;
    }
    if (el === boundary) return null;
    el = el.parentElement;
  }
  return null;
};

/**
 * 자식이 세로 제스처를 직접 소유하는 영역인가.
 *
 * framer-motion 의 drag 요소는 세로 pan 을 제외한 touch-action 을 인라인으로 써 두기 때문에
 * computed style 만으로도 대부분 걸러진다(예: BottomFlexDrawer 본문에서 도는 RulletPicker
 * 휠 — 스크롤 컨테이너가 없어서 그냥 두면 휠을 돌릴 때마다 시트가 따라온다).
 * 휴리스틱이 놓치는 경우를 위해 SHEET_NO_DRAG_ATTR 수동 표식도 함께 본다.
 */
const ownsVerticalGesture = (from: HTMLElement | null, boundary: HTMLElement): boolean => {
  let el: HTMLElement | null = from;
  while (el) {
    if (el.hasAttribute(SHEET_NO_DRAG_ATTR)) return true;
    const { touchAction } = getComputedStyle(el);
    if (touchAction === "none" || touchAction === "pan-x" || touchAction === "pinch-zoom") {
      return true;
    }
    if (el === boundary) return false;
    el = el.parentElement;
  }
  return false;
};

/** 본문 영역에 붙일 callback ref 를 돌려준다. */
export default function useSheetBodyDrag(handlers: SheetBodyDragHandlers) {
  // 리스너는 노드에 한 번만 붙이고, 매 렌더 바뀌는 콜백은 ref 로 읽는다.
  // (BottomFlexDrawer·CafeListSheet 가 window 리스너에 쓰는 것과 같은 관례)
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const stateRef = useRef<{
    phase: Phase;
    startX: number;
    startY: number;
    scrollEl: HTMLElement | null;
  }>({ phase: "idle", startX: 0, startY: 0, scrollEl: null });

  const nodeRef = useRef<HTMLElement | null>(null);

  const onTouchStart = useCallback((event: TouchEvent) => {
    const state = stateRef.current;
    const node = nodeRef.current;
    if (!node) return;

    if (handlersRef.current.enabled === false) {
      state.phase = "released";
      return;
    }
    // 멀티터치(핀치 등)는 우리 것이 아니다.
    if (event.touches.length !== 1) {
      if (state.phase === "claimed") handlersRef.current.onDragCancel();
      state.phase = "released";
      return;
    }

    const target = event.target as HTMLElement | null;
    if (ownsVerticalGesture(target, node)) {
      state.phase = "released";
      return;
    }

    const touch = event.touches[0];
    state.scrollEl = findScrollableAncestor(target, node);
    state.startX = touch.clientX;
    state.startY = touch.clientY;
    state.phase = "undecided";
    // 여기서는 아무것도 확정하지 않는다. preventDefault 도 하지 않는다.
  }, []);

  const onTouchMove = useCallback((event: TouchEvent) => {
    const state = stateRef.current;
    if (state.phase === "idle" || state.phase === "released") return;

    const touch = event.touches[0];
    if (!touch) return;

    if (state.phase === "claimed") {
      if (event.cancelable) event.preventDefault();
      handlersRef.current.onDragMove(touch.clientY, event.timeStamp);
      return;
    }

    // 여기부터 undecided.
    // cancelable 이 아니면 브라우저가 이미 스크롤을 가져간 것이다. 그대로 양보한다
    // (오늘과 같은 동작으로 떨어질 뿐, 스크롤과 시트가 동시에 움직이는 일은 없다).
    if (!event.cancelable) {
      state.phase = "released";
      return;
    }

    const dx = touch.clientX - state.startX;
    const dy = touch.clientY - state.startY; // + : 아래로
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > DECIDE_SLOP) {
      state.phase = "released";
      return;
    }
    if (Math.abs(dy) < DECIDE_SLOP) return; // 아직 판단 보류

    const { canDragUp, canDragDown, onDragStart, onDragMove } = handlersRef.current;

    // 스크롤 가능한 영역 안이고 그 방향으로 더 스크롤할 여지가 남아 있으면 스크롤이 우선이다.
    // 방향을 따지지 않고 위로 미는 것을 전부 시트가 가져가면, 중간 단계에서 목록이 양쪽 다
    // 막혀 아예 스크롤되지 않는다(위는 시트가 가져가고 아래는 scrollTop 0 이라 또 가져감).
    // 스크롤이 끝까지 간 뒤에야 시트 드래그로 넘긴다 — 사용자가 설명한 그 의도다.
    // (모바일 사파리는 바운스 중 scrollTop 이 음수가 될 수 있어 경계를 여유 있게 잡는다.)
    const el = state.scrollEl;
    const scrollWins = el
      ? dy > 0
        ? el.scrollTop > 0 // 아직 위로 더 스크롤할 수 있다
        : el.scrollTop < el.scrollHeight - el.clientHeight - 1 // 아직 아래로 더 남았다
      : false;
    if (scrollWins) {
      state.phase = "released";
      return;
    }

    // peek 처럼 목록 스크롤이 잠긴 단계에서는 scrollEl 이 없어 곧바로 여기로 온다.
    const claim = dy > 0 ? canDragDown() : canDragUp();
    if (!claim) {
      state.phase = "released";
      return;
    }

    state.phase = "claimed";
    event.preventDefault();
    // 원점을 지금 위치로 다시 잡는다 — 판정에 쓴 slop 만큼 시트가 튀지 않게.
    onDragStart(touch.clientY, event.timeStamp);
    onDragMove(touch.clientY, event.timeStamp);
  }, []);

  const onTouchEnd = useCallback((event: TouchEvent) => {
    const state = stateRef.current;
    if (state.phase === "claimed") {
      const touch = event.changedTouches[0];
      if (touch) handlersRef.current.onDragEnd(touch.clientY, event.timeStamp);
      else handlersRef.current.onDragCancel();
    }
    state.phase = "idle";
    state.scrollEl = null;
  }, []);

  const onTouchCancel = useCallback(() => {
    const state = stateRef.current;
    if (state.phase === "claimed") handlersRef.current.onDragCancel();
    state.phase = "idle";
    state.scrollEl = null;
  }, []);

  const detach = useCallback(() => {
    const node = nodeRef.current;
    if (!node) return;
    node.removeEventListener("touchstart", onTouchStart);
    node.removeEventListener("touchmove", onTouchMove);
    node.removeEventListener("touchend", onTouchEnd);
    node.removeEventListener("touchcancel", onTouchCancel);
  }, [onTouchStart, onTouchMove, onTouchEnd, onTouchCancel]);

  // callback ref 인 이유: CafeListSheet 는 화면 높이를 알기 전까지 null 을 반환해서
  // 본문 노드가 늦게 마운트된다. useRef 로는 그 시점을 잡지 못한다.
  const setNode = useCallback(
    (node: HTMLElement | null) => {
      detach();
      nodeRef.current = node;
      stateRef.current.phase = "idle";
      if (!node) return;
      // touchmove 는 preventDefault 를 해야 하므로 반드시 passive: false.
      node.addEventListener("touchstart", onTouchStart, { passive: true });
      node.addEventListener("touchmove", onTouchMove, { passive: false });
      node.addEventListener("touchend", onTouchEnd, { passive: true });
      node.addEventListener("touchcancel", onTouchCancel, { passive: true });
    },
    [detach, onTouchStart, onTouchMove, onTouchEnd, onTouchCancel],
  );

  // 드래그 중 언마운트돼도 리스너가 남지 않게 한다.
  useEffect(() => detach, [detach]);

  return setNode;
}
