/* eslint-disable */

import { Box, Button } from "@chakra-ui/react";
import { faEllipsis } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { DEFAULT_IMAGE_URL } from "../../assets/images/imageUrl";
import KakaoShareBtn from "../../components/atoms/Icons/KakaoShareBtn";
import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import ButtonGroups, { IButtonOpions } from "../../components/molecules/groups/ButtonGroups";
import ImageSlider from "../../components/organisms/imageSlider/ImageSlider";
import { ACTIVE_LOCATIONS } from "../../constants/locationConstants";
import { WEB_URL } from "../../constants/system";
import { useErrorToast } from "../../hooks/custom/CustomToast";
import { useGatherAllSummaryQuery } from "../../hooks/gather/queries";
import ReviewContent from "../../pageTemplates/review/ReviewContent";
import ReviewGatherSummary from "../../pageTemplates/review/ReviewGatherSummary";
import ReviewItemHeader from "../../pageTemplates/review/ReviewItemHeader";
import ReviewStatus from "../../pageTemplates/review/ReviewStatus";
import { IReviewData, REVIEW_DATA } from "../../storage/Review";
import { IGatherLocation, IGatherType } from "../../types/models/gatherTypes/gatherTypes";
import {
  ActiveLocation,
  ActiveLocationAll,
  LocationEn,
  LocationFilterType,
} from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";

export interface IGatherSummary {
  title: string;
  type: IGatherType;
  location: IGatherLocation;
  date: string;
  id: number;
  place: LocationFilterType;
}

interface IReview extends IReviewData {
  summary?: IGatherSummary;
}

function Review() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const location = searchParams.get("location");

  const errorToast = useErrorToast();
  const [initialData, setInitialData] = useState<IReview[]>();
  const [reviewData, setReviewData] = useState<IReview[]>();
  const [category, setCategory] = useState<ActiveLocationAll>("전체");

  const reviewContentId = searchParams.get("scroll");

  const [visibleCnt, setVisibleCnt] = useState(8);

  const writers = {
    이승주: {
      name: "이승주",
      profileImage: null,
      avatar: { bg: 0, type: 11 },
    },
    서유진: { name: "서유진", profileImage: null, avatar: { bg: 3, type: 7 } },
    찬민: {
      name: "찬민",
      profileImage:
        "https://p.kakaocdn.net/th/talkp/wnUXvUROY2/jUp0CmCy3sXzVO8hEoLZhk/duaypz_640x640_s.jpg",
      avatar: null,
    },
    윤경: {
      name: "윤경",
      profileImage: null,
      avatar: { bg: 0, type: 8 },
    },
    재욱: {
      name: "재욱",
      profileImage:
        "https://p.kakaocdn.net/th/talkp/wn07WrT0Bp/xZrUl20KAKbNB3QKIvG4Bk/hjiiy1_640x640_s.jpg",
      avatar: null,
    },
    김석훈: {
      name: "김석훈",
      profileImage:
        "http://k.kakaocdn.net/dn/cWx5rA/btr7dOzI5TO/AW8kPq23hSHFF7TjSihJ91/img_640x640.jpg",
      avatar: null,
    },
    최지아: {
      name: "최지아",
      profileImage:
        "https://p.kakaocdn.net/th/talkp/woeoxF3Sok/CwC8U0RXEY4zM2nnOl7MN0/wxwkco_640x640_s.jpg",
      avatar: null,
    },
    김지훈: {
      name: "김지훈",
      profileImage: DEFAULT_IMAGE_URL,
    },
  };

  const { data: gatherAllData } = useGatherAllSummaryQuery({
    enabled: !initialData,
    onError: errorToast,
  });

  useEffect(() => {
    if (!gatherAllData) return;
    const reviewObject = gatherAllData.reduce((acc, summary) => {
      acc[summary.id] = summary;
      return acc;
    }, {});
    const updatedReviewData = REVIEW_DATA.slice()
      .reverse()
      .map((review) => {
        const findItem = reviewObject[review.id];
        return {
          ...review,
          place: findItem?.place ?? review.place,
          summary: findItem && { ...findItem },
        };
      });
    setInitialData(updatedReviewData);
    setReviewData(updatedReviewData);
  }, [gatherAllData]);

  useEffect(() => {
    if (!initialData) return;
    if (category === "전체") setReviewData(initialData);
    else {
      const filtered = initialData.filter(
        (item) => item.place === category || item.place === "전체",
      );
      setReviewData(filtered);
    }
  }, [category, initialData]);

  useEffect(() => {
    if (reviewContentId && reviewData) {
      const element = document.getElementById(`review${reviewContentId}`);

      if (element) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: "smooth",
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewContentId, reviewData]);

  const handleLoadMore = () => {
    setVisibleCnt((old) => old + 8);
  };

  const buttonArr: IButtonOpions[] = ["전체", ...ACTIVE_LOCATIONS].map((location) => ({
    text: location,
    func: () =>
      location === "전체"
        ? router.replace("/review")
        : router.replace(
            `/review?location=${convertLocationLangTo(location as ActiveLocation, "en")}`,
          ),
  }));

  return (
    <>
      <Header title="모임 리뷰">
        <KakaoShareBtn
          title="모임 리뷰"
          subtitle="즐거운 모임 가득 ~!"
          url={`${WEB_URL}/review?location=${location}`}
          img={REVIEW_DATA && REVIEW_DATA[0]?.images[0]}
        />
      </Header>

      {reviewData ? (
        <Slide>
          <Layout>
            <>
              <Box p="12px 16px">
                <ButtonGroups
                  buttonDataArr={buttonArr}
                  currentValue={convertLocationLangTo(location as LocationEn, "kr") || "전체"}
                />
              </Box>

              <Main>
                {reviewData.slice(0, visibleCnt).map((item) => (
                  <Item id={"review" + item.id} key={item.id}>
                    <ReviewItemHeader
                      writer={writers[item?.writer || "이승주"]}
                      date={item.dateCreated}
                    />
                    <ImageWrapper>
                      <ImageSlider imageContainer={item.images} type="review" />
                    </ImageWrapper>
                    {item.summary ? <ReviewGatherSummary summary={item.summary} /> : <Spacing />}
                    {item?.text && <ReviewContent text={item.text} />}
                    <ReviewStatus />
                  </Item>
                ))}
                {visibleCnt < reviewData.length && (
                  <Button
                    onClick={handleLoadMore}
                    m="var(--gap-4)"
                    colorScheme="gray"
                    boxShadow="var(--shadow)"
                    color="var(--gray-3)"
                  >
                    <Box mr="var(--gap-2)">더 보기</Box>
                    <FontAwesomeIcon icon={faEllipsis} />
                  </Button>
                )}
              </Main>
            </>
          </Layout>
        </Slide>
      ) : (
        <MainLoading />
      )}
    </>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-1);
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  border: var(--border);
  box-shadow: var(--shadow);
`;

const Spacing = styled.div`
  height: var(--gap-5);
`;

export default Review;
