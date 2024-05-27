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

export default ImageSliderPoint;
