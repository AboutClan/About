interface BannerProps {
  image: string;
  category?: string;
  url?: string;
}

export const MAIN_BANNER_IMAGE: BannerProps[] = [
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/%EC%8A%A4%ED%84%B0%EB%94%94.png",
    category: "study",
  },
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/0627-%EC%86%8C%EB%AA%A8%EC%9E%84-%EB%B0%B0%EB%84%88-%EC%B5%9C%EC%A2%85.png",
    category: "study",
  },
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/0702-%ED%8F%AC%EC%9D%B8%ED%8A%B8-%EC%8A%A4%ED%86%A0%EC%96%B4-%EB%B0%B0%EB%84%88-%EC%B5%9C%EC%A2%85.png",
    category: "store",
    url: "/store",
  },
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/0627-%EC%97%90%ED%83%80-%ED%99%8D%EB%B3%B4-%EB%B0%B0%EB%84%88-%EC%B5%9C%EC%A2%85.png",
    category: "promotion",
    url: "/promotion",
  },
];

export const GATHER_BANNER_IMAGE: BannerProps[] = [
  {
    image:
      "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%B0%B0%EB%84%88/0627-%EB%AA%A8%EC%9E%84-%EB%B0%B0%EB%84%88-%EC%B5%9C%EC%A2%85.png",
    category: "gather",
    url: "/gather",
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
