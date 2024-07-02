import "swiper/css/autoplay";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import SwiperCore from "swiper";
import { Autoplay, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useTypeToast } from "../../../../hooks/custom/CustomToast";

SwiperCore.use([Autoplay, Scrollbar]);

export interface ImageBannerProp {
  url: string;
  imageUrl: string;
}

interface IImageSliderEventBanner {
  imageArr: ImageBannerProp[];
  isLightBanner?: boolean;
}

function ImageSliderBanner({ imageArr, isLightBanner }: IImageSliderEventBanner) {
  const typeToast = useTypeToast();
  const router = useRouter();
  const [pageNum, setPageNum] = useState(0);

  const handleSliderChange = (swiper) => {
    setPageNum(swiper.realIndex);
  };

  const onClick = (url: string) => {
    if (url) {
      router.push(url);
    } else {
      typeToast("not-yet");
    }
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
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
    >
      {imageArr.map((item, index) => (
        <SwiperSlide key={index}>
          <Box onClick={() => onClick(item?.url)}>
            <Container>
              <Box position="relative" aspectRatio={isLightBanner ? "4/1" : "2.1/1"}>
                <Image
                  src={item.imageUrl}
                  fill={true}
                  sizes="400px"
                  alt="eventImg"
                  priority={index === 0}
                />
              </Box>
            </Container>
          </Box>
        </SwiperSlide>
      ))}
      {!isLightBanner && (
        <Box
          w="80px"
          p="2px 4px"
          color="white"
          opacity={0.75}
          pos="absolute"
          bgColor="var(--gray-800)"
          zIndex={10}
          bottom="0"
          right="0"
          fontSize="12px"
          onClick={() => router.push("/banner")}
        >
          {pageNum + 1} / {imageArr.length} 전체보기
        </Box>
      )}
    </Swiper>
  );
}
const Container = styled.div``;

export default ImageSliderBanner;
