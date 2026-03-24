import "swiper/css/scrollbar";

import Image from "next/image";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";

import { ImageContainer } from "../ImageSlider";

interface IImageSliderSpecialBg {
  imageContainer: ImageContainer;
  onClick: (idx: number) => void;
}

function ImageSliderSpecialBg({ imageContainer, onClick }: IImageSliderSpecialBg) {
  return (
    <Swiper
      navigation
      scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
      style={{
        width: "100%",
        height: "auto",
      }}
      slidesPerView={5.3}
    >
      {(imageContainer as { name: string; image: string }[]).map((item, index) => (
        <SwiperSlide key={index}>
          <AvatarColorItem onClick={() => onClick(index)}>
            <Image src={item.image} fill alt="" />
          </AvatarColorItem>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

const AvatarColorItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;

  align-items: center;
  border: var(--border-main);
  /* > span {
    font-size: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  } */
`;

export default ImageSliderSpecialBg;
