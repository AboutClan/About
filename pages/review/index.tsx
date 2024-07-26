/* eslint-disable */

import { Box, Button } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import KakaoShareBtn from "../../components/atoms/Icons/KakaoShareBtn";
import { MainLoading } from "../../components/atoms/loaders/MainLoading";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import ButtonGroups, { IButtonOptions } from "../../components/molecules/groups/ButtonGroups";
import FeedLayout from "../../components/organisms/FeedLayout";
import { LOCATION_OPEN } from "../../constants/location";
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { WEB_URL } from "../../constants/system";
import { useErrorToast } from "../../hooks/custom/CustomToast";
import { useGatherAllSummaryQuery } from "../../hooks/gather/queries";
import { IReviewData, REVIEW_DATA } from "../../storage/Review";
import { IGatherLocation, IGatherType } from "../../types/models/gatherTypes/gatherTypes";
import {
  ActiveLocation,
  ActiveLocationAll,
  LocationEn,
  LocationFilterType,
} from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

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

  const buttonArr: IButtonOptions[] = ["전체", ...LOCATION_OPEN].map((location) => ({
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
                  buttonItems={buttonArr}
                  currentValue={convertLocationLangTo(location as LocationEn, "kr") || "전체"}
                />
              </Box>

              <Main>
                {reviewData.slice(0, visibleCnt).map((item) => {
                  const summary = item?.summary;
                  const summaryProps = summary && {
                    url: `/gather/${item.summary.id}`,
                    title: item.summary.title,
                    text: `${summary.place} · ${summary.type.title} · ${dayjsToFormat(dayjs(summary.date), "M월 D일")} · ${summary.location.main}`,
                  };
                  return (
                    <FeedLayout
                      user={ABOUT_USER_SUMMARY}
                      date={item.dateCreated}
                      images={item.images}
                      summary={summaryProps}
                      content={item.text}
                      likeUsers={[]}
                      likeCnt={0}
                      id={item.id + ""}
                    />
                  );
                })}
                {visibleCnt < reviewData.length && (
                  <Button
                    onClick={handleLoadMore}
                    m="var(--gap-4)"
                    colorScheme="gray"
                    color="var(--gray-600)"
                  >
                    <Box mr="var(--gap-2)">더 보기</Box>
                    <i className="fa-solid fa-ellipsis" />
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
`;

const Spacing = styled.div`
  height: var(--gap-5);
`;

export default Review;
