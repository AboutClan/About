import {
  ALL_스터디인증,
  ANYANG_금정역,
  ANYANG_범계역,
  ANYANG_범계학원가점,
  ANYANG_안양역,
  ANYANG_인덕원역,
  ANYANG_호계점,
  DONG_경희대점,
  DONG_길음역,
  DONG_노원역,
  DONG_동대문역,
  DONG_딥십리역,
  DONG_서울시립대점,
  DONG_석계역,
  DONG_성신여대점,
  DONG_수유역,
  DONG_신설동역,
  DONG_안암역,
  DONG_왕십리역,
  DONG_월곡역,
  DONG_장안동사거리점,
  DONG_중화역,
  DONG_한성대입구역점,
  DONG_혜화역,
  DONG_화랑대역,
  DONG_회기역,
  GANGNAM_강남구청역,
  GANGNAM_강남역,
  GANGNAM_강남역아라타워점,
  GANGNAM_교대법원점,
  GANGNAM_교대역,
  GANGNAM_논현역,
  GANGNAM_도곡동점,
  GANGNAM_선릉역,
  GANGNAM_신논현역,
  INC_구월동점,
  INC_부평점,
  INC_서구청점,
  INC_송도DT점,
  INC_송도점,
  INC_송도캐슬파크점,
  INC_인천대점,
  INC_인천서구청점,
  INC_인하대역점,
  INC_인하대점,
  INC_인하대점2,
  INC_청라점,
  SUWAN_경기대,
  SUWAN_경희대,
  SUWAN_고색역,
  SUWAN_광교,
  SUWAN_광교엘리웨이,
  SUWAN_광교역,
  SUWAN_구운동,
  SUWAN_망포역,
  SUWAN_상현역,
  SUWAN_성균관대역,
  SUWAN_송죽,
  SUWAN_수원시청,
  SUWAN_수원역,
  SUWAN_수원역2,
  SUWAN_수원종합운동장점,
  SUWAN_아주대,
  SUWAN_아주대2,
  SUWAN_청년바람지대,
  SUWAN_행궁동,
  YANG_광명철산점,
  YANG_까치산역,
  YANG_당산역,
  YANG_대방역점,
  YANG_등촌역,
  YANG_목동10단지점,
  YANG_목동점,
  YANG_발산역,
  YANG_선유도점,
  YANG_신길역,
  YANG_신도림역,
  YANG_신월동점,
  YANG_신촌점,
  YANG_신풍역,
  YANG_양천구청역,
  YANG_양천목동점,
  YANG_여의도브라이튼점,
  YANG_여의도역,
  YANG_영등포구청역,
  YANG_오목교역,
  YANG_홍대땡땡거리점,
  YANG_홍대역1번출구점,
  YANG_홍대입구역점,
  YANG_화곡DT점,
  YANG_화곡역,
} from "./studyPlaceConstants";

export const PLACE_TO_NAME = {
  //전체
  [ALL_스터디인증]: "개인 스터디",

  //수원
  [SUWAN_수원시청]: "투썸플레이스",
  [SUWAN_수원역]: "엔제리너스",
  [SUWAN_수원역2]: "디저트39",
  [SUWAN_아주대]: "카탈로그",
  [SUWAN_아주대2]: "탐앤탐스",
  [SUWAN_상현역]: "투썸플레이스",
  [SUWAN_송죽]: "커피빈",
  [SUWAN_경희대]: "칸나",
  [SUWAN_구운동]: "이디야",

  [SUWAN_광교역]: "탐앤탐스",
  [SUWAN_고색역]: "에이티씨",
  [SUWAN_성균관대역]: "스타벅스",
  [SUWAN_광교엘리웨이]: "책발전소",
  [SUWAN_경기대]: "워터쿨러",
  [SUWAN_망포역]: "스타벅스",
  [SUWAN_행궁동]: "행궁동",
  [SUWAN_광교]: "디어커피",
  [SUWAN_청년바람지대]: "청년바람지대",
  [SUWAN_수원종합운동장점]: "스타벅스",

  //양천
  [YANG_등촌역]: "위카페",
  [YANG_당산역]: "할리스",
  [YANG_까치산역]: "파스쿠찌",
  [YANG_오목교역]: "이디야",
  [YANG_영등포구청역]: "카페베네",
  [YANG_화곡DT점]: "스타벅스",
  [YANG_여의도역]: "카페꼼마",
  [YANG_신도림역]: "몽글",
  [YANG_신풍역]: "이디야",
  [YANG_신길역]: "레어 그루브",
  [YANG_신월동점]: "코나빈스",
  [YANG_양천구청역]: "시나본",
  [YANG_화곡역]: "투썸플레이스",
  [YANG_발산역]: "스타벅스",
  [YANG_목동점]: "스타벅스",
  [YANG_홍대입구역점]: "할리스",
  [YANG_홍대역1번출구점]: "커피덕",
  [YANG_홍대땡땡거리점]: "가비애",
  [YANG_여의도브라이튼점]: "스타벅스",
  [YANG_양천목동점]: "파스쿠찌",
  [YANG_신촌점]: "캐치카페",
  [YANG_선유도점]: "에이바우트",
  [YANG_목동10단지점]: "스타벅스",
  [YANG_대방역점]: "디저트39",
  [YANG_광명철산점]: "투썸플레이스",

  //안양
  [ANYANG_금정역]: "커피인더스트리",
  [ANYANG_범계역]: "숨맑은집",
  [ANYANG_안양역]: "파스쿠찌",
  [ANYANG_인덕원역]: "인뎃커피",
  [ANYANG_범계학원가점]: "숨맑은집",
  [ANYANG_호계점]: "숨맑은집",

  //강남
  [GANGNAM_강남역]: "커피빈",
  [GANGNAM_신논현역]: "커피빈",
  [GANGNAM_논현역]: "커피빈",
  [GANGNAM_교대역]: "아펜즈커피",

  [GANGNAM_선릉역]: "커피빈",

  [GANGNAM_도곡동점]: "카페올로",
  [GANGNAM_강남구청역]: "파스쿠찌",
  [GANGNAM_강남역아라타워점]: "투썸플레이스",
  [GANGNAM_교대법원점]: "스타벅스",

  //동대문
  [DONG_장안동사거리점]: "투썸플레이스",
  [DONG_석계역]: "카페디졸브",
  [DONG_딥십리역]: "아띠커피",
  [DONG_서울시립대점]: "해머스미스커피",
  [DONG_경희대점]: "빵쌤",
  [DONG_월곡역]: "카페어바웃",
  [DONG_왕십리역]: "어질인",
  [DONG_안암역]: "캐치카페",
  [DONG_신설동역]: "커피니",
  [DONG_길음역]: "일일커피",
  [DONG_성신여대점]: "카페 뮬",
  [DONG_동대문역]: "D CAFE",
  [DONG_혜화역]: "캐치카페",

  [DONG_화랑대역]: "마르티",
  [DONG_중화역]: "스타벅스",
  [DONG_노원역]: "투썸플레이스",
  [DONG_수유역]: "엔제리너스",
  [DONG_회기역]: "READSTREET",
  [DONG_한성대입구역점]: "카공족",

  //인천
  [INC_인하대점]: "더스토리",

  [INC_구월동점]: "파스쿠찌",
  [INC_송도점]: "카페꼼마",
  [INC_부평점]: "하이테이블",
  [INC_인천대점]: "스타벅스",
  [INC_서구청점]: "하이테이블",
  [INC_송도DT점]: "스타벅스",
  [INC_송도캐슬파크점]: "스타벅스",
  [INC_인천서구청점]: "할리스",
  [INC_인하대역점]: "스타벅스",
  [INC_인하대점2]: "스타벅스",
  [INC_청라점]: "카페보니또",
};
