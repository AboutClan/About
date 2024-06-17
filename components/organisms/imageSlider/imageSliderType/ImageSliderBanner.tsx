import "swiper/css/scrollbar";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";

export interface ImageBannerProp {
  url: string;
  imageUrl: string;
}

interface IImageSliderEventBanner {
  imageArr: ImageBannerProp[];
}

function ImageSliderBanner({ imageArr }: IImageSliderEventBanner) {
  const [pageNum, setPageNum] = useState(0);

  const handleSliderChange = (swiper) => {
    setPageNum(swiper.realIndex);
  };

  return (
    <Swiper
      navigation
      scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
      style={{
        width: "100%",
        height: "auto",
        position: "relative",
      }}
      slidesPerView={1}
      onSlideChange={handleSliderChange}
    >
      {imageArr.map((item, index) => (
        <SwiperSlide key={index}>
          <Link href={item.url}>
            <Container>
              <AvatarColorItem>
                <Image src={item.imageUrl} fill={true} sizes="400px" alt="eventImg" />
              </AvatarColorItem>
            </Container>
          </Link>
        </SwiperSlide>
      ))}
      <Box
        p="2px 4px"
        color="white"
        opacity={0.8}
        pos="absolute"
        bgColor="var(--gray-800)"
        zIndex={10}
        bottom="0"
        right="0"
        fontSize="12px"
      >
        {pageNum + 1} / {imageArr.length} 전체보기
      </Box>
    </Swiper>
  );
}
const Container = styled.div``;

const AvatarColorItem = styled.div`
  position: relative;
  height: 180px;
`;

export default ImageSliderBanner;
