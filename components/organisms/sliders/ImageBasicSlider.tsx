import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation, Pagination]);

export interface ImageTileProps {
  imageUrl: string;
  func: () => void;
  text?: string;
}

interface IImageTileSlider {
  imageTileArr: ImageTileProps[];
  size: "sm" | "md" | "full";
  selectedImageUrl?: string;
  aspect?: number;
}

function ImageBasicSlider({ imageTileArr, size, selectedImageUrl, aspect = 1 }: IImageTileSlider) {
  return (
    <Swiper slidesPerView={size === "sm" ? 4.4 : size === "md" ? 3.6 : 1} spaceBetween={20}>
      {imageTileArr.map((imageTile, index) => (
        <SwiperSlide key={index}>
          <Flex direction="column" align="center">
            <Box
              w={size === "sm" ? "64px" : size === "md" ? "80px" : "100%"}
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
            {imageTile?.text && (
              <Flex justify="center" w="72px">
                <Box
                  textAlign="center"
                  fontSize="12px"
                  mt="8px"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "1",
                    overflow: "hidden",
                  }}
                >
                  {imageTile.text}
                </Box>
              </Flex>
            )}
          </Flex>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ImageBasicSlider;
