import { faEyes } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";

import { reviewContentIdState } from "../../../../recoils/previousAtoms";
import { IImageSliderItem, ImageContainer } from "../ImageSlider";

interface IImageSliderGatherReviewNav {
  imageContainer: ImageContainer;
}

function ImageSliderGatherReviewNav({ imageContainer }: IImageSliderGatherReviewNav) {
  const router = useRouter();
  const setReviewContentId = useSetRecoilState(reviewContentIdState);
  const onClickReviewItem = (id: number) => {
    if (id) setReviewContentId(id);
    router.push("review");
  };

  return (
    <Swiper
      navigation
      style={{
        width: "100%",
        height: "auto",
        marginLeft: "var(--gap-3)",
      }}
      slidesPerView={4.5}
    >
      <SwiperSlide onClick={() => onClickReviewItem(0)}>
        <ReviewItem>
          <ReviewIcon>
            <FontAwesomeIcon icon={faEyes} size="2x" color="var(--color-mint)" />
          </ReviewIcon>
          <Text>리뷰 둘러보기</Text>
        </ReviewItem>
      </SwiperSlide>
      {(imageContainer as IImageSliderItem[]).map((item, index) => (
        <SwiperSlide key={index} onClick={() => onClickReviewItem(item.id)}>
          <GatherReviewNavItem>
            <ImageWrapper>
              <Image
                src={item.image}
                alt={`Slide ${index}`}
                width={54}
                height={54}
                priority={index < 4}
              />
            </ImageWrapper>
            <Text>{item.title}</Text>
          </GatherReviewNavItem>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

const GatherReviewNavItem = styled.button`
  width: 74px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--gray-900);
`;

const ReviewItem = styled(GatherReviewNavItem)`
  > div:last-child {
    white-space: nowrap;
  }
`;

const ImageWrapper = styled.div`
  border-radius: var(--rounded);
  width: 54px;
  height: 54px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--gap-2);
  box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.16);
`;

const Text = styled.div`
  font-size: 11px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReviewIcon = styled(ImageWrapper)`
  box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.16);
  background-color: var(--gray-200);
`;
export default ImageSliderGatherReviewNav;
