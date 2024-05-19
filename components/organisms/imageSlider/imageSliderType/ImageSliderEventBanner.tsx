import "swiper/css/scrollbar";

import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";

import { ImageContainer } from "../ImageSlider";

interface IImageSliderEventBanner {
  imageContainer: ImageContainer;
}

function ImageSliderEventBanner({ imageContainer }: IImageSliderEventBanner) {
  const [pageNum, setPageNum] = useState(0);

  const handleSliderChange = (swiper) => {
    setPageNum(swiper.realIndex);
  };

  return (
    <Swiper
      navigation
      scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
      style={{
        width: "100%",
        height: "auto",
        position: "relative",
      }}
      slidesPerView={1}
      onSlideChange={handleSliderChange}
    >
      {(imageContainer as string[]).map((item, index) => (
        <SwiperSlide key={index}>
          <Container>
            <AvatarColorItem>
              <Image src={item} fill={true} sizes="400px" alt="eventImg" />
            </AvatarColorItem>
          </Container>
        </SwiperSlide>
      ))}
      <PageView>
        <span>{pageNum + 1}</span>
        <span>/3</span>
      </PageView>
    </Swiper>
  );
}
const Container = styled.div``;

const AvatarColorItem = styled.div`
  position: relative;
  height: 90px;
`;

const PageView = styled.div`
  width: 32px;
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 8px;
  z-index: 10;

  font-weight: 500;
  > span:first-child {
    color: white;
  }
  > span:last-child {
    color: var(--gray-300);
  }
`;

export default ImageSliderEventBanner;
