// 카공지도 세션 표식.
//
// 카공지도는 어바웃과 별개의 앱이지만 같은 도메인의 같은 페이지들을 공유한다. 그래서 카공지도
// 스터디 탭에서 스터디 상세(/study/...)로 들어가면, 그 화면은 어바웃에서 들어온 것과 구분되지
// 않아 뒤로가기가 어바웃 화면(/studyPage 등)으로 빠져버린다.
//
// UA는 두 앱이 `about_club_app`으로 동일해서 판별에 쓸 수 없다. 대신 "이 웹뷰 세션이 /cafe-map
// 에서 시작했는가"를 sessionStorage에 남긴다. 카공지도 앱 웹뷰의 첫 화면은 항상 /cafe-map이고
// (cafe-map-app/App.tsx의 appConfig.uri), 어바웃 앱은 카공지도 화면으로 들어오지 않으므로
// 이 표식이 곧 "카공지도 컨텍스트"를 뜻한다.
//
// 링크마다 from=cafe-map 쿼리를 다는 방식은 하나라도 빠뜨리면 그대로 어바웃으로 새어나가서,
// "어떠한 경우에도 어바웃으로 넘어가지 않는다"를 보장하지 못한다. 세션 단위 표식은 경유하는
// 링크가 무엇이든 유지된다.
const CAFE_MAP_SESSION_KEY = "cafeMapSession";
const CAFE_MAP_LAST_PATH_KEY = "cafeMapLastPath";

// 사파리 프라이빗 모드 등에서 sessionStorage 접근 자체가 throw 할 수 있다.
const read = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // 무시 — 표식이 없으면 기존 동작(어바웃 기준)으로 떨어질 뿐이다.
  }
};

const remove = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // 무시
  }
};

/** /cafe-map 계열 화면에 들어왔음을 기록한다. */
export const markCafeMapSession = () => {
  write(CAFE_MAP_SESSION_KEY, "1");
};

/** 이 세션이 카공지도에서 시작했는가. */
export const isCafeMapSession = (): boolean => read(CAFE_MAP_SESSION_KEY) === "1";

/**
 * 카공지도를 의도적으로 벗어날 때만 호출한다(게스트 안내 모달의 "이동").
 * 이후에는 평범한 어바웃 세션으로 취급된다.
 */
export const clearCafeMapSession = () => {
  remove(CAFE_MAP_SESSION_KEY);
  remove(CAFE_MAP_LAST_PATH_KEY);
};

/**
 * 돌아갈 카공지도 화면을 기록한다. 탭은 ?tab= 쿼리로만 갈리므로(CafeMapBottomNav) 쿼리까지
 * 담아둬야 스터디 탭에서 나갔다가 지도 탭으로 튀지 않는다.
 */
export const saveCafeMapReturnPath = (asPath: string) => {
  write(CAFE_MAP_LAST_PATH_KEY, asPath);
};

/** 마지막으로 머물던 카공지도 화면. 기록이 없으면 지도 탭. */
export const getCafeMapReturnPath = (): string =>
  read(CAFE_MAP_LAST_PATH_KEY) || "/cafe-map";
