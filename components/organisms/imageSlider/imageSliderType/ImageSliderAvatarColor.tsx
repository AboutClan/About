import "swiper/css/scrollbar";

import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";

import { ImageContainer } from "../ImageSlider";

interface IImageSliderAvatarColor {
  imageContainer: ImageContainer;
  onClick: (idx: number) => void;
}

function ImageSliderAvatarColor({ imageContainer, onClick }: IImageSliderAvatarColor) {
  return (
    <Swiper
      navigation
      scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
      style={{
        width: "100%",
        height: "auto",
      }}
      slidesPerView={4.6}
    >
      {(imageContainer as string[]).map((item, index) => (
        <SwiperSlide key={index}>
          <AvatarColorItem onClick={() => onClick(index)}>
            <Color bg={item} />
          </AvatarColorItem>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
const Color = styled.div<{ bg: string }>`
  min-width: 40px;
  min-height: 40px;
  border-radius: 50%;
  margin-right: var(--gap-3);
  background-color: ${(props) => props.bg};
`;
const AvatarColorItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 68px;
  align-items: center;
  > span {
    font-size: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export default ImageSliderAvatarColor;
