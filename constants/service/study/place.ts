import { LocationProps } from "../../../types/common";
import { StudyCrew } from "../../../types/models/studyTypes/study-entity.types";

export interface CrewLocationProps extends LocationProps {
  standard: string;
  rating: number;
}

export const STUDY_CREW_PLACE_MAPPING: Record<StudyCrew, CrewLocationProps[]> = {
  "[성북/동대문/노원]": [
    {
      name: "카페 뮬",
      address: "서울특별시 성북구",
      latitude: 37.590298,
      longitude: 127.018552,
      standard: "성여입",
      rating: 4.5,
    },
    {
      name: "할리스 노원문화의거리점",
      address: "서울특별시 노원구",
      latitude: 37.65583,
      longitude: 127.063982,
      standard: "노원역",
      rating: 4,
    },
    {
      name: "한시십일분",
      address: "서울특별시 동대문구",
      latitude: 37.588692,
      longitude: 127.057927,
      standard: "회기역",
      rating: 4,
    },
    {
      name: "카페 디졸브",
      address: "서울특별시 성북구",
      latitude: 37.61385,
      longitude: 127.06436,
      standard: "석계역",
      rating: 4,
    },
  ],
  "[강남/서초]": [
    {
      name: "셀렉티드닉스",
      address: "서울특별시 강남구",
      latitude: 37.496193,
      longitude: 127.030907,
      standard: "강남역",
      rating: 4,
    },
    {
      name: "더 엘씨",
      address: "서울특별시 서초구",
      latitude: 37.491944,
      longitude: 127.011443,
      standard: "교대역",
      rating: 4.5,
    },
    {
      name: "테라로사 포스코센터점",
      address: "서울특별시 강남구",
      latitude: 37.506063,
      longitude: 127.056083,
      standard: "선릉역",
      rating: 4.5,
    },
    {
      name: "카페엔바이콘 논현점",
      address: "서울특별시 강남구",
      latitude: 37.517252,
      longitude: 127.022966,
      standard: "신사역",
      rating: 5,
    },
  ],
  "[성수/왕십리/건대]": [
    {
      name: "엔제리너스커피 건대역점",
      address: "서울특별시 광진구",
      latitude: 37.54024,
      longitude: 127.070525,
      standard: "건대입구역",
      rating: 4.5,
    },
    {
      name: "포어플랜",
      address: "서울특별시 성동구",
      latitude: 37.548201,
      longitude: 127.047559,
      standard: "뚝섬역",
      rating: 5,
    },
    {
      name: "오소리 베이커리 어린이대공원 본점",
      address: "서울특별시 광진구",
      latitude: 37.546511,
      longitude: 127.07351,
      standard: "어린이대공원",
      rating: 5,
    },
  ],
  "[마포/당산/영등포]": [
    {
      name: "할리스 홍대역2번출구점",
      address: "서울특별시 마포구",
      latitude: 37.557795,
      longitude: 126.923103,
      standard: "홍대입구역",
      rating: 4.5,
    },
  ],
  "[수원/용인]": [
    {
      name: "수원시청년지원센터 청년바람지대",
      address: "수원시 팔달구",
      latitude: 37.26424,
      longitude: 127.030092,
      standard: "수원시청역",
      rating: 4.5,
    },
  ],
};
