import Image from "next/image";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ImageContainer } from "../ImageSlider";

SwiperCore.use([Navigation, Pagination]);

interface IImageSliderReview {
  imageContainer: ImageContainer;
}

function ImageSliderReview({ imageContainer }: IImageSliderReview) {
  console.log(14, imageContainer);
  return (
    <Swiper
      // lazy={true}
      navigation
      pagination={true}
      style={{ width: "100%", height: "100%" }}
    >
      {imageContainer?.map((image, index) => (
        <SwiperSlide key={index}>
          <Image
            src={`${image}`}
            alt={`Slide ${index}`}
            fill={true}
            sizes="400px"
            priority={index === 0}
            style={{ objectPosition: "center", objectFit: "cover" }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ImageSliderReview;
