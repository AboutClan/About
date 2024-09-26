import { RecommendationBannerCardProps } from "../../components/organisms/cards/RecommendationBannerCard";

export const HOME_RECOMMENDATION_TAB_CONTENTS: RecommendationBannerCardProps[] = [
  {
    title: "동아리 점수 랭킹 페이지",
    text: "동아리 활동을 통해 얻은 점수를 확인하고 자신의 랭킹과 활동 기록을 한눈에 볼 수 있는 공간입니다. 다양한 활동을 통해 점수를 획득하고, 본인의 순위를 확인해 보세요!",
    bannerImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/%EB%9E%AD%ED%82%B9+%EB%B0%B0%EB%84%88.png",
    buttonProps: {
      link: "/statistics",
      text: "랭킹 페이지로 이동하기",
    },
  },
  {
    title: "ABOUT 디스코드 채널",
    text: "온라인에서도 활발하게 스터디를 진행하고 있습니다! 다양한 컨셉의 스터디 채널이 있으니, 디스코드 서버에 방문하고 같이 공부해요!",
    bannerImage:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/%EB%94%94%EC%8A%A4%EC%BD%94%EB%93%9C+%EB%B0%B0%EB%84%88.jpg",
    buttonProps: {
      link: "https://discord.gg/dDu2kg2uez",
      text: "디스코드 서버로 이동하기",
    },
  },
];
