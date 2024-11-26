interface BannerProps {
  image: string;
  category?: string;
  url?: string;
}

export const MAIN_BANNER_IMAGE: BannerProps[] = [
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/KakaoTalk_20241125_231707601.png",
    category: "study",
  },

  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/KakaoTalk_20241126_191413319.png",
    category: "store",
    url: "/store",
  },
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/KakaoTalk_20241125_231646096.png",
    category: "promotion",
    url: "/promotion",
  },
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/KakaoTalk_20241125_231716808.png",
    category: "group",
    url: "/group",
  },
];

export const GATHER_BANNER_IMAGE: BannerProps[] = [
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/KakaoTalk_20241125_231746782.png",
    category: "gather",
    url: "/gather",
  },
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/KakaoTalk_20240708_164733650.png",
    category: "mt",
    url: "https://mewing-sombrero-e36.notion.site/MT-8a80cd27947c4d16a4dc04afca11693d",
  },
];
export const CLUB_BANNER_IMAGE: BannerProps[] = [
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/%EB%8F%99%EC%95%84%EB%A6%AC+%EC%BA%98%EB%A6%B0%EB%8D%94.png",
    category: "calendar",
  },
];

export const BANNER_IMAGE = [...MAIN_BANNER_IMAGE, ...GATHER_BANNER_IMAGE, ...CLUB_BANNER_IMAGE];
