import { IMapOptions } from "@/types/externals/naverMapTypes";

// 카공지도는 벡터(GL) 지도로 띄워 줌이 단계 없이 부드럽게 이어지게 한다(커스텀 스타일은 쓰지 않음).
// 신규 키(ncpKeyId)로 gl 서브모듈이 로드됐을 때만 적용한다 — 구 키에선 gl 옵션을 주면 지도가 뜨지 않는다.
export const CAFE_MAP_STYLE_OPTIONS: Partial<IMapOptions> = process.env.NEXT_PUBLIC_NAVER_MAP_KEY_ID
  ? { gl: true }
  : {};

/**
 * 지도 SDK 준비 여부. 스크립트가 defer 라 gl 서브모듈은 본체 뒤에 비동기로 따로 받는다.
 * 그 사이(naver.maps 는 있는데 jsContentLoaded 가 false)에 gl 지도를 만들면 빈 화면이 된다.
 */
export const isNaverMapReady = (needsGl = !!CAFE_MAP_STYLE_OPTIONS.gl) => {
  if (typeof naver === "undefined" || !naver.maps) return false;
  return !needsGl || !!(naver.maps as unknown as { jsContentLoaded?: boolean }).jsContentLoaded;
};
