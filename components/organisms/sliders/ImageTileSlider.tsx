import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { AspectRatio, Box } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import styled, { css } from "styled-components";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { SingleLineText } from "../../../styles/layout/components";

SwiperCore.use([Navigation, Pagination]);

type Size = "sm" | "md" | "lg";

export interface IImageTile {
  imageUrl: string;
  text: string;
  url: string;
  priority?: boolean;
}

interface IImageTileSlider {
  imageTileArr: IImageTile[];
  size: Size;
  slidesPerView: number;
  aspect?: number;
}

function ImageTileSlider({ imageTileArr, size, aspect = 1, slidesPerView }: IImageTileSlider) {
  return (
    <Swiper slidesPerView={slidesPerView} spaceBetween={12}>
      {imageTileArr.map((imageTile, index) => (
        <SwiperSlide key={index}>
          <CustomLink size={size} href={imageTile.url}>
            <Box p={size === "sm" && "4px"} bgColor="white">
              <AspectRatio
                ratio={aspect / 1}
                pos="relative"
                rounded="md"
                overflow="hidden"
                border="var(--border)"
                bgColor="white"
              >
                <Image
                  src={imageTile.imageUrl}
                  priority={imageTile?.priority}
                  fill={true}
                  alt="slideImage"
                  sizes="60px"
                />
              </AspectRatio>
            </Box>
            <Text size={size}>{imageTile.text}</Text>
          </CustomLink>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

const CustomLink = styled(Link)<{ size: Size }>`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: var(--rounded-lg);
  border: var(--border);
  padding: 4px;
  box-shadow: var(--shadow);

  ${(props) => {
    switch (props.size) {
      case "sm":
        return css`
          border: none;
        `;
      case "md":
        return css`
          padding: 12px;
          padding-bottom: 4px;
          border: var(--border);
          box-shadow: var(--shadow);
        `;
      default:
        return css``;
    }
  }}
`;

const Text = styled(SingleLineText)<{ size: Size }>`
  text-align: center;

  padding-top: 4px;
  font-size: 12px;
  ${(props) => {
    switch (props.size as Size) {
      case "sm":
        return css``;
      case "md":
        return css`
          font-weight: 600;
        `;
    }
  }}
`;

export default ImageTileSlider;
