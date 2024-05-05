"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import Image from "next/image";
import { useState } from "react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation, Pagination]);

interface IBannerSlider {
  imageArr: string[];
}

function BannerSlider({ imageArr }: IBannerSlider) {
  const [pageNum, setPageNum] = useState(0);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleSliderChange = (swiper: any) => {
    setPageNum(swiper.realIndex);
  };

  return (
    <Swiper
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
      slidesPerView={1}
      onSlideChange={handleSliderChange}
    >
      {imageArr.map((item, index) => (
        <SwiperSlide key={index}>
          <Image src={item} fill={true} alt="eventImg" />
        </SwiperSlide>
      ))}
      <div className="w-8 absolute bottom-1 right-1 bg-black bg-opacity-30 text-xs p-1 px-1.5 rounded-lg z-10 font-medium">
        <span className="color-white">{pageNum + 1}</span>
        <span className="text-gray-6">/2</span>
      </div>
    </Swiper>
  );
}

export default BannerSlider;
