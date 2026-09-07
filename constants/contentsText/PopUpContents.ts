import { IContentPopUpContents } from "@/components/modals/common/ContentPopUp";

export const MEMEBER_MASKING_AND_FRIEND: IContentPopUpContents = {
  title: "스터디 멤버 비공개 및 친구 기능",
  contents: [
    {
      subtitle: "스터디 신청자 프로필 관련",
      content: [
        "OPEN된 경우를 제외한 모든 스터디 신청자는 비공개",
        "FREE & CLOSED의 경우, 신청자끼리는 서로 공개",
        "친구 등록이 되어 있는 경우, 모든 경우에서 서로 공개",
      ],
    },
    {
      subtitle: "친구 기능 관련",
      content: [
        "상대의 프로필 페이지에서 친구 요청/해제 가능",
        "상대가 수락한 경우 친구가 됨 (알림, 마이페이지 참고)",
        "친구 등록이 되어있는 경우 프로필 공개, 스터디 추가 포인트, 좋아요 전송 등 여러 기능 제공 & 추가 예정",
      ],
    },
  ],
};

export const NEW_POINT_SYSTEM: IContentPopUpContents = {
  title: "스터디 시스템 변경 공지",
  contents: [
    {
      subtitle: "스터디 관련",
      content: [
        "매월 /1, 11, 21, 31일/만 비공개 투표 방식으로 진행",
        "투표시 기본으로 얻는 포인트는 /서브 장소당 +1 point/",
        "스터디 투표시 장소 당 최초 3명까지 추가 포인트 획득 가능. 순서대로 /+10 point, +5 point, +2 point/",
      ],
    },
    {
      subtitle: "기타",
      content: [
        "동아리 점수는 이제 /스터디 출석체크/로만 획득 가능",
        "새롭게 /정기 스터디/ 진행",
        "매달 /열활멤버/ 선착순 모집",
      ],
    },
  ],
};
