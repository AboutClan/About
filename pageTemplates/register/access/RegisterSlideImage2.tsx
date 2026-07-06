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

function RegisterSlideImage2() {
  const [zoomImage, setZoomImage] = useState<string>(null);

  const imageArr = [
    "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EA%B3%B5%EB%B6%80.jpg",
    "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%AC%B8%ED%99%94.jpg",
    "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/%EB%9D%BC%EC%9D%B4%ED%94%84.png",
  ];

  return (
    <>
      <Flex flexDir="column" alignItems="center" mt={10} textAlign="center">
        <Stack spacing={2} mb={5}>
          <Badge alignSelf="center" px={3} py={1} borderRadius="md" bg="mint" color="white">
            04
          </Badge>

          <Heading fontSize="2xl">제휴처 소개</Heading>
          <Text color="gray.500">
            어바웃 멤버가 되면 아래 <b>제휴처 혜택</b>을 받을 수 있어요!
          </Text>
        </Stack>
        <StyledSwiper
          scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
          style={{
            width: "100%",
            height: "auto",
            position: "relative",
          }}
          slidesPerView={1.4}
          spaceBetween={20}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={4000}
          loop
        >
          {imageArr.map((item, index) => (
            <SwiperSlide key={index}>
              <Box mr={0} borderRadius="20px" overflow="hidden" onClick={() => setZoomImage(item)}>
                <Box position="relative" aspectRatio="4/5">
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
      {zoomImage && <ImageZoomModal imageUrl={zoomImage} setIsModal={() => setZoomImage(null)} />}
    </>
  );
}

const StyledSwiper = styled(Swiper)`
  .swiper-wrapper {
    display: -webkit-inline-box;
  }
`;

export default RegisterSlideImage2;
