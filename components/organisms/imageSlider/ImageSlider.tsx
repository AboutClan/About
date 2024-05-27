import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; // for the pagination dots

import styled from "styled-components";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import ImageSliderAvatarColor from "./imageSliderType/ImageSliderAvatarColor";
import ImageSliderEventBanner from "./imageSliderType/ImageSliderEventBanner";
import ImageSliderGatherReviewNav from "./imageSliderType/ImageSliderGatherReviewNav";
import ImageSliderMember from "./imageSliderType/ImageSliderMember";
import ImageSliderPoint from "./imageSliderType/ImageSliderPoint";
import ImageSliderReview from "./imageSliderType/ImageSliderReview";

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
}

function ImageSlider({ type, imageContainer, onClick }: IImageSlider) {
  return (
    <>
      {imageContainer && (
        <Layout isHeight={type === "review"}>
          {type === "point" ? (
            <ImageSliderPoint imageContainer={imageContainer} />
          ) : imageContainer?.length && type === "review" ? (
            <ImageSliderReview imageContainer={imageContainer} />
          ) : type === "gatherReviewNav" ? (
            <ImageSliderGatherReviewNav imageContainer={imageContainer} />
          ) : type === "member" ? (
            <ImageSliderMember imageContainer={imageContainer} />
          ) : type === "avatarColor" ? (
            <ImageSliderAvatarColor imageContainer={imageContainer} onClick={onClick} />
          ) : type === "eventBanner" ? (
            <ImageSliderEventBanner imageContainer={imageContainer} />
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
