import "swiper/css/autoplay";
import "swiper/css/pagination";

import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import SwiperCore from "swiper";
import { Autoplay, Pagination, Scrollbar } from "swiper/modules";
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
    <StyledSwiper
      navigation
      pagination={true}
      modules={[Pagination]}
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
        disableOnInteraction: true,
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
    </StyledSwiper>
  );
}

const StyledSwiper = styled(Swiper)`
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
  .swiper-pagination-bullet:nth-child(1) {
    width: 12px; /* 첫 번째 원의 가로 길이 */
    height: 4px;
    border-radius: 16px;
    opacity: 0.6;
  }
`;

const Container = styled.div``;

export default ImageSliderBanner;
