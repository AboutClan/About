import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation, Pagination]);

interface IImageTile {
  imageUrl: string;
  func: () => void;
}

interface IImageTileSlider {
  imageTileArr: IImageTile[];
  size: "sm" | "full";
  selectedImageUrl: string;
  aspect?: number;
}

function ImageBasicSlider({ imageTileArr, size, selectedImageUrl, aspect = 1 }: IImageTileSlider) {
  return (
    <Swiper slidesPerView={size === "sm" ? 3.6 : 1} spaceBetween={20}>
      {imageTileArr.map((imageTile, index) => (
        <SwiperSlide key={index}>
          <Box
            w={size === "sm" ? "80px" : "100%"}
            aspectRatio={aspect}
            borderRadius="var(--rounded-lg)"
            position="relative"
            overflow="hidden"
            pos="relative"
            rounded="md"
            border={
              imageTile.imageUrl === selectedImageUrl ? "var(--border-mint)" : "var(--border)"
            }
            bgColor="white"
            onClick={imageTile.func}
            as="button"
          >
            <Image
              src={imageTile.imageUrl}
              alt="thumbnailImage"
              fill={true}
              sizes={size === "sm" ? "80px" : "360px"}
            />
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ImageBasicSlider;
