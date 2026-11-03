/**
 * PC에서는 본문(#__next)이 최대 너비(var(--max-width))로 화면 가운데에 놓인다.
 * position: fixed 요소를 right로 붙이면 화면 오른쪽 끝에 붙어 본문 밖으로 나가므로,
 * 본문 오른쪽 끝에서 px만큼 떨어진 위치를 계산해 쓴다. 모바일(화면이 최대 너비보다 좁을 때)은 그대로 px.
 */
export const fixedRightInColumn = (px: number) =>
  `calc(max(0px, (100vw - var(--max-width)) / 2) + ${px}px)`;
