import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import ImageZoomModal from "../../../modals/ImageZoomModal";

SwiperCore.use([Navigation, Pagination]);

export interface ImageUploadTileProps {
  imageUrl: string;
  func: (url: string) => void;
}

interface IImageTileSlider {
  imageTileArr: ImageUploadTileProps[];
  size: "sm" | "md" | "full";
  selectedImageUrl?: string;
  aspect?: number;
}

function ImageUploadSlider({ imageTileArr, size, selectedImageUrl, aspect = 1 }: IImageTileSlider) {
  const [zoomImage, setZoomImage] = useState<string>(null);
  return (
    <>
      <Swiper slidesPerView={size === "sm" ? 4.8 : size === "md" ? 3.6 : 1} spaceBetween={20}>
        {imageTileArr.map((imageTile, index) => (
          <SwiperSlide key={index}>
            <Box position="relative" overflow="visible" my="8px">
              <Box
                w={size === "sm" ? "64px" : size === "md" ? "80px" : "100%"}
                aspectRatio={aspect}
                borderRadius="var(--rounded-lg)"
                position="relative"
                overflow="hidden"
                rounded="md"
                border={
                  imageTile.imageUrl === selectedImageUrl ? "var(--border-mint)" : "var(--border)"
                }
                bgColor="white"
                as="button"
                onClick={() => setZoomImage(imageTile.imageUrl)}
              >
                <Image
                  src={imageTile.imageUrl}
                  alt="thumbnailImage"
                  fill={true}
                  sizes={size === "sm" ? "80px" : "360px"}
                  objectFit="cover"
                  objectPosition="center"
                />
                {index === 0 && (
                  <Box
                    py="2px"
                    color="white"
                    fontSize="10px"
                    pos="absolute"
                    bottom="0"
                    w="100%"
                    bgColor="black"
                  >
                    대표사진
                  </Box>
                )}
              </Box>
              <XButton onClick={() => imageTile.func(imageTile.imageUrl)}>
                <i className="fa-regular fa-x fa-xs" />
              </XButton>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      {zoomImage && <ImageZoomModal imageUrl={zoomImage} setIsModal={() => setZoomImage(null)} />}
    </>
  );
}

const XButton = styled.button`
  position: absolute;
  top: 2px;
  right: -2px;
  transform: translate(50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  background-color: black;
  color: white;
  font-size: 10px;
  z-index: 100;
  border-radius: 50%;
`;

export default ImageUploadSlider;
