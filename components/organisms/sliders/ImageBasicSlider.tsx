import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Box, Flex, Skeleton } from "@chakra-ui/react";
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
  firstItem?: {
    icon: React.ReactNode;
    func: () => void;
    text: string;
  };
  selectedImageUrl?: string;
  aspect?: number;
  hasTextSkeleton?: boolean;
}

function ImageBasicSlider({
  imageTileArr,
  size,
  selectedImageUrl,
  firstItem,
  aspect = 1,
  hasTextSkeleton = true,
}: IImageTileSlider) {
  return (
    <Swiper slidesPerView={size === "sm" ? 4.5 : size === "md" ? 3.6 : 1} spaceBetween={20}>
      {firstItem && (
        <SwiperSlide>
          <Flex ml="4px" direction="column" align="center">
            <Box
              w={size === "sm" ? "64px" : size === "md" ? "80px" : "100%"}
              aspectRatio={aspect}
              borderRadius="var(--rounded-lg)"
              position="relative"
              rounded="md"
              border="var(--border-main)"
              bgColor="white"
              onClick={firstItem.func}
              as="button"
              borderWidth="2px"
            >
              {firstItem.icon}
            </Box>
            {firstItem?.text && (
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
                  {firstItem.text}
                </Box>
              </Flex>
            )}
          </Flex>
        </SwiperSlide>
      )}
      {(imageTileArr || [1, 2, 3, 4]).map((imageTile, index) => (
        <SwiperSlide key={index}>
          <Flex direction="column" align="center">
            <Skeleton
              w={size === "sm" ? "64px" : size === "md" ? "80px" : "100%"}
              h={size === "sm" ? "64px" : size === "md" ? "80px" : "100%"}
              isLoaded={!!imageTile?.imageUrl}
            >
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
                onClick={imageTile.func}
                as="button"
              >
                {imageTile?.imageUrl && (
                  <Image
                    src={imageTile.imageUrl}
                    alt="thumbnailImage"
                    fill={true}
                    sizes={size === "sm" ? "80px" : "360px"}
                  />
                )}
              </Box>
            </Skeleton>
            <Skeleton
              w={imageTile?.text ? "72px" : "44px"}
              h="18px"
              mt={2}
              isLoaded={!!imageTile?.text || !hasTextSkeleton}
            >
              <Flex justify="center" w="72px">
                <Box
                  textAlign="center"
                  fontSize="12px"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "1",
                    overflow: "hidden",
                  }}
                >
                  {imageTile?.text}
                </Box>
              </Flex>
            </Skeleton>
          </Flex>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ImageBasicSlider;
