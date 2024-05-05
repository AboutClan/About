import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation, Pagination]);

interface IBlockSlider {
  slidesPerView: number;
  blocks: React.ReactNode[];
}

function BlockSlider({ slidesPerView, blocks }: IBlockSlider) {
  return (
    <Swiper slidesPerView={slidesPerView} spaceBetween={12}>
      {blocks.map((block, index) => (
        <SwiperSlide key={index}>{block}</SwiperSlide>
      ))}
    </Swiper>
  );
}

export default BlockSlider;
