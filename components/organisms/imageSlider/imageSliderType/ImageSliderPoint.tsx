import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";

import { ImageContainer } from "../ImageSlider";

interface IImageSliderPoint {
  imageContainer: ImageContainer;
}

const ITEM_WIDTH = 74;

function ImageSliderPoint({ imageContainer }: IImageSliderPoint) {
  return (
    <Swiper
      navigation
      style={{
        width: "100%",
        height: "auto",
      }}
      slidesPerView={3.2}
    >
      {imageContainer.map((image, index) => (
        <SwiperSlide key={index}>
          {/* <PointItem>
            <Image
              src={image}
              alt={`Slide ${index}`}
              width="80%"
              height="80%"
              priority={index < 4}
            />
          </PointItem> */}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

const PointItem = styled.div`
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${ITEM_WIDTH}px;
  height: ${ITEM_WIDTH}px;
  border: 1px solid var(--gray-400);
  overflow: hidden;
  border-radius: var(--rounded-lg);
`;

export default ImageSliderPoint;
