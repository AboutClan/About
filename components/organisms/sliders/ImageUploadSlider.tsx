import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Box, Image } from "@chakra-ui/react";
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
                <XIcon />
              </XButton>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      {zoomImage && <ImageZoomModal imageUrl={zoomImage} setIsModal={() => setZoomImage(null)} />}
    </>
  );
}

function XIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 -960 960 960"
    width="16px"
    fill="white"
  >
    <path d="M480-424 364-308q-11 11-28 11t-28-11q-11-11-11-28t11-28l116-116-116-115q-11-11-11-28t11-28q11-11 28-11t28 11l116 116 115-116q11-11 28-11t28 11q12 12 12 28.5T651-595L535-480l116 116q11 11 11 28t-11 28q-12 12-28.5 12T595-308L480-424Z" />
  </svg>
}

const XButton = styled.button`
  position: absolute;
  top: 2px;
  right: 3px;
  transform: translate(50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  background-color: var(--gray-800);
  color: white;
  z-index: 100;
  border-radius: 50%;
`;

export default ImageUploadSlider;
