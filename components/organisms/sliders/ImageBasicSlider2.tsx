import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Box, Flex, Skeleton } from "@chakra-ui/react";
import Image from "next/image";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import ImageShadowCover from "../../molecules/ImageShadowCover";

SwiperCore.use([Navigation, Pagination]);

export interface ImageTileProps {
  imageUrl: string;
  func: () => void;
  text?: string;
}

interface IImageTileSlider {
  imageTileArr: ImageTileProps[];

  selectedImageUrl?: string;
  aspect?: number;
  hasTextSkeleton?: boolean;
}

function ImageBasicSlider2({ imageTileArr, selectedImageUrl, aspect = 1 }: IImageTileSlider) {
  const doubleMap: ImageTileProps[][] = [];

  imageTileArr?.forEach((image, index) => {
    if (index % 2 === 0) {
      doubleMap.push([image]);
    } else {
      doubleMap[doubleMap.length - 1].push(image);
    }
  });
  console.log(doubleMap);
  return (
    <Swiper slidesPerView={aspect === 1 ? 3.6 : 1.8}>
      {doubleMap?.map((imageTile, index) => (
        <SwiperSlide key={index}>
          <Flex direction="column" align="center">
            <Skeleton
              position="relative"
              mb={2}
              h="98px"
              aspectRatio={aspect}
              isLoaded={!!imageTile[0]?.imageUrl}
            >
              <Box
                w="full"
                aspectRatio={aspect}
                borderRadius="var(--rounded-lg)"
                position="relative"
                overflow="hidden"
                rounded="md"
                border={
                  imageTile[0].imageUrl === selectedImageUrl
                    ? "var(--border-mint)"
                    : "var(--border)"
                }
                bgColor="white"
                onClick={imageTile[0].func}
                as="button"
              >
                {imageTile[0]?.imageUrl && (
                  <Image
                    src={imageTile[0].imageUrl}
                    alt="thumbnailImage"
                    fill={true}
                    sizes="98px"
                    priority={index <= (aspect === 1 ? 3 : 1)}
                  />
                )}
              </Box>
              {imageTile[0].imageUrl === selectedImageUrl && (
                <ImageShadowCover text="선택" color="mint" size="sm" />
              )}
            </Skeleton>
            {imageTile?.[1] && (
              <Skeleton
                position="relative"
                aspectRatio={aspect}
                h="98px"
                isLoaded={!!imageTile?.[1]?.imageUrl}
              >
                <Box
                  w="full"
                  aspectRatio={aspect}
                  borderRadius="var(--rounded-lg)"
                  position="relative"
                  overflow="hidden"
                  rounded="md"
                  border={
                    imageTile?.[1]?.imageUrl === selectedImageUrl
                      ? "var(--border-mint)"
                      : "var(--border)"
                  }
                  bgColor="white"
                  onClick={imageTile?.[1].func}
                  as="button"
                >
                  {imageTile?.[1]?.imageUrl && (
                    <Image
                      src={imageTile?.[1]?.imageUrl}
                      alt="thumbnailImage"
                      fill={true}
                      sizes="98px"
                      priority={index <= (aspect === 1 ? 3 : 1)}
                    />
                  )}
                </Box>{" "}
                {imageTile[1].imageUrl === selectedImageUrl && (
                  <ImageShadowCover text="선택" color="mint" size="sm" />
                )}
              </Skeleton>
            )}
          </Flex>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ImageBasicSlider2;
