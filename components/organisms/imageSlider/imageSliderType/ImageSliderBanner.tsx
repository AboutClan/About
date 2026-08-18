import "swiper/css/autoplay";
import "swiper/css/pagination";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import SwiperCore from "swiper";
import { Autoplay, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Autoplay, Scrollbar]);

export interface ImageBannerProp {
  func: () => void;
  imageUrl: string;
}

interface IImageSliderEventBanner {
  imageArr: ImageBannerProp[];
  isLightBanner?: boolean;
}

function ImageSliderBanner({ imageArr, isLightBanner }: IImageSliderEventBanner) {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <StyledSwiper
      navigation
      index={currentSlide + 1}
      pagination={true}
      modules={[Pagination]}
      scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
      style={{
        width: "100%",
        height: "auto",
        position: "relative",
      }}
      slidesPerView={1}
      onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
      autoplay={{
        delay: 5000,
        disableOnInteraction: true,
      }}
    >
      {imageArr.map((item, index) => (
        <SwiperSlide key={index}>
          <Box onClick={item.func}>
            <Box position="relative" aspectRatio={isLightBanner ? "4/1" : "2.1/1"}>
              <Image
                src={item.imageUrl}
                fill={true}
                sizes="400px"
                alt="eventImg"
                priority={index === 0}
              />
            </Box>
          </Box>
        </SwiperSlide>
      ))}
    </StyledSwiper>
  );
}

const StyledSwiper = styled(Swiper)<{ index: number }>`
  .swiper-wrapper {
    display: -webkit-inline-box;
  }
  .swiper-pagination-bullet {
    background-color: white;
    width: 4px;
    height: 4px;
    opacity: 0.8;
  }

  .swiper-pagination-bullet-active {
    background-color: var(--color-mint);
  }
  .swiper-pagination-bullet:nth-child(${(props) => props.index}) {
    width: 12px; /* 첫 번째 원의 가로 길이 */
    height: 4px;
    border-radius: 16px;
    opacity: 0.6;
  }
`;

export default ImageSliderBanner;
