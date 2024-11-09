import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { AspectRatio, Box, Flex } from "@chakra-ui/react";
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
  text?: string;
  url?: string;
  func?: () => void;
  priority?: boolean;
  type?: "circle";
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
          {imageTile.type === "circle" ? (
            <Link href={imageTile.url}>
              <Flex direction="column" h="84px" w="64px">
                <Flex
                  justify="center"
                  align="center"
                  w="64px"
                  h="64px"
                  border="2px solid var(--gray-300)"
                  borderRadius="50%"
                  p="2px"
                >
                  <Box w="56px" h="56px" borderRadius="50%" position="relative" overflow="hidden">
                    <Image
                      src={imageTile.imageUrl}
                      priority={imageTile?.priority}
                      fill={true}
                      alt="slideImage"
                      sizes="60px"
                    />
                  </Box>
                </Flex>
                <Box
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  mt={2}
                  fontSize="10px"
                  fontWeight="medium"
                  color="gray.600"
                  lineHeight="12px"
                  h="12px"
                >
                  {imageTile.text}
                </Box>
              </Flex>
            </Link>
          ) : (
            <Wrapper size={size} onClick={imageTile?.func}>
              {imageTile?.url ? (
                <CustomLink href={imageTile.url}>
                  <SlideItem imageTile={imageTile} size={size} aspect={aspect} />
                </CustomLink>
              ) : (
                <SlideItem imageTile={imageTile} size={size} aspect={aspect} />
              )}
            </Wrapper>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function SlideItem({
  imageTile,
  size,
  aspect,
}: {
  imageTile: IImageTile;
  size: Size;
  aspect: number;
}) {
  return (
    <>
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
      {imageTile?.text && <Text size={size}>{imageTile.text}</Text>}
    </>
  );
}

const Wrapper = styled.div<{ size: Size }>`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: var(--rounded-lg);
  border: var(--border-main);
  padding: 4px;

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
          border: var(--border-main);
        `;
      default:
        return css``;
    }
  }}
`;

const CustomLink = styled(Link)``;

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
