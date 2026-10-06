/**
 * 스터디 지역 묶음(생활권). 서버 vote2.service.ts의 toStudyZone과 같은 규칙이다 — 바꾸면 양쪽을 같이 고친다.
 * 라운지 "지역 멤버" 탭과 신청자 목록의 지역 배지가 같은 이름을 쓰게 한다.
 */
const SEOUL_ZONES: Record<string, string[]> = {
  "강남·서초": ["강남구", "서초구"],
  "송파·강동": ["송파구", "강동구"],
  "관악·동작": ["관악구", "동작구"],
  "영등포·강서": ["영등포구", "구로구", "금천구", "양천구", "강서구"],
  "마포·서대문·은평": ["마포구", "서대문구", "은평구"],
  "종로·중구·용산": ["종로구", "중구", "용산구"],
  "성동·광진": ["성동구", "광진구"],
  "성북·동대문·중랑": ["성북구", "동대문구", "중랑구"],
  "노원·도봉·강북": ["노원구", "도봉구", "강북구"],
};

const GYEONGGI_SOUTH = [
  "수원시",
  "용인시",
  "성남시",
  "화성시",
  "안양시",
  "군포시",
  "의왕시",
  "과천시",
  "오산시",
  "평택시",
  "안산시",
  "시흥시",
  "광명시",
  "부천시",
  "하남시",
  "광주시",
  "이천시",
];

export const toStudyZone = (address?: string | null): string | null => {
  const [city, district] = (address ?? "").trim().split(/\s+/);
  if (!city) return null;
  if (city.startsWith("서울")) {
    const zone = Object.entries(SEOUL_ZONES).find(([, gus]) => gus.includes(district));
    return zone ? zone[0] : "서울 기타";
  }
  if (city.startsWith("경기")) {
    return GYEONGGI_SOUTH.includes(district) ? "경기 남부" : "경기 북부·동부";
  }
  if (GYEONGGI_SOUTH.includes(city)) return "경기 남부";
  if (city.startsWith("인천")) return "인천";
  return "기타 지역";
};
