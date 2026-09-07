import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; // for the pagination dots

import styled from "styled-components";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import ImageSliderAvatarColor from "@/components/organisms/imageSlider/imageSliderType/ImageSliderAvatarColor";
import ImageSliderGatherReviewNav from "@/components/organisms/imageSlider/imageSliderType/ImageSliderGatherReviewNav";
import ImageSliderPoint from "@/components/organisms/imageSlider/imageSliderType/ImageSliderPoint";
import ImageSliderReview from "@/components/organisms/imageSlider/imageSliderType/ImageSliderReview";
import ImageSliderSpecialBg from "@/components/organisms/imageSlider/imageSliderType/ImageSliderSpecialBg";

// eslint-disable-next-line react-hooks/rules-of-hooks -- Swiper의 static 메서드이며 React Hook이 아니다 (react-hooks v5 오탐)
SwiperCore.use([Navigation, Pagination]); // apply the Pagination module
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ImageContainer = any;

export interface IImageSliderItem {
  image: string;
  title: string;
  id: number;
}

interface IImageSlider {
  type: string;
  imageContainer: ImageContainer;
  onClick?: (idx?: number) => void;
  /** 도메인 전용 슬라이드는 여기로 주입한다. 주입하면 아래 내장 타입 분기 대신 이것이 렌더된다. */
  children?: React.ReactNode;
}

function ImageSlider({ type, imageContainer, onClick, children }: IImageSlider) {
  return (
    <>
      {imageContainer && (
        <Layout isHeight={type === "review"}>
          {children ? (
            children
          ) : type === "point" ? (
            <ImageSliderPoint imageContainer={imageContainer} />
          ) : imageContainer?.length && type === "review" ? (
            <ImageSliderReview imageContainer={imageContainer} />
          ) : type === "gatherReviewNav" ? (
            <ImageSliderGatherReviewNav imageContainer={imageContainer} />
          ) : type === "avatarColor" ? (
            <ImageSliderAvatarColor imageContainer={imageContainer} onClick={onClick} />
          ) : type === "specialBg" ? (
            <ImageSliderSpecialBg imageContainer={imageContainer} onClick={onClick} />
          ) : null}
        </Layout>
      )}
    </>
  );
}

const Layout = styled.div<{ isHeight: boolean }>`
  text-align: center;
  width: 100%;
  height: ${(props) => (props.isHeight ? "100%" : "auto")};

  .swiper-pagination-bullet {
    background-color: var(--color-mint);
  }
`;

export default ImageSlider;
