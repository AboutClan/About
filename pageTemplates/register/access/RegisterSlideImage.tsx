import "swiper/css/autoplay";
import "swiper/css/pagination";

import { Badge, Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import SwiperCore from "swiper";
import { Autoplay, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import ImageZoomModal from "../../../modals/ImageZoomModal";

SwiperCore.use([Autoplay, Scrollbar]);

function RegisterSlideImage() {
  const [zoomImage, setZoomImage] = useState<string>(null);

  const imageArr = [
    "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%8A%A4%ED%84%B0%EB%94%94.png",
    "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%B2%88%EA%B0%9C.png",
    "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EC%86%8C%EB%AA%A8%EC%9E%84.png",
    "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%ED%94%84%EB%A1%9C%ED%95%84.png",
  ];

  return (
    <>
      <Flex flexDir="column" alignItems="center" mt={10} textAlign="center">
        <Stack spacing={2} mb={5}>
          <Badge alignSelf="center" px={3} py={1} borderRadius="md" bg="mint" color="white">
            02
          </Badge>

          <Heading fontSize="2xl">활동 소개</Heading>
          <Text color="gray.500">
            공부, 취미, 친목 등 <b>내 취향대로</b> 참여할 수 있어요.
          </Text>
        </Stack>
        <StyledSwiper
          scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
          style={{
            width: "100%",
            height: "auto",
            position: "relative",
          }}
          slidesPerView={2.2}
          spaceBetween={20}
        >
          {imageArr.map((item, index) => (
            <SwiperSlide key={index}>
              <Box mr={0} borderRadius="20px" overflow="hidden" onClick={() => setZoomImage(item)}>
                <Box position="relative" aspectRatio="1/1.78">
                  <Image
                    src={item}
                    fill={true}
                    sizes="400px"
                    alt="eventImg"
                    priority={index === 0}
                  />
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </StyledSwiper>
      </Flex>
      {zoomImage && (
        <ImageZoomModal imageUrl={zoomImage} setIsModal={() => setZoomImage(null)} isThumbnail />
      )}
    </>
  );
}

const StyledSwiper = styled(Swiper)<{ index: number }>`
  .swiper-wrapper {
    display: -webkit-inline-box;
  }
  .swiper-pagination-bullet {
    background-color: white;
    width: 4px;
    height: 4px;
    opacity: 0.8;
  }

  .swiper-pagination-bullet-active {
    background-color: var(--color-mint);
  }
  .swiper-pagination-bullet:nth-child(${(props) => props.index}) {
    width: 12px; /* 첫 번째 원의 가로 길이 */
    height: 4px;
    border-radius: 16px;
    opacity: 0.6;
  }
`;

export default RegisterSlideImage;
