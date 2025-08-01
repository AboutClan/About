import "swiper/css/autoplay";
import "swiper/css/pagination";

import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import SwiperCore from "swiper";
import { Autoplay, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ShortArrowIcon } from "../Icons/ArrowIcons";

SwiperCore.use([Autoplay, Scrollbar]);

export interface textProps {
  name: string;
  gift: string;
}

interface IImageSliderEventBanner {
  textArr: textProps[];
  isLightBanner?: boolean;
}

function TextSlider({ textArr, isLightBanner }: IImageSliderEventBanner) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const onClick = (url: string) => {
    if (url) {
      router.push(url);
    }
  };

  return (
    <StyledSwiper
      navigation
      index={currentSlide + 1}
      direction="vertical"
      pagination={true}
      modules={[Pagination]}
      scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
      style={{
        flex: "1",
        height: "auto",
        position: "relative",
      }}
      slidesPerView={1}
      onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
      // autoplay={{
      //   delay: 3000,
      //   disableOnInteraction: true,
      // }}
    >
      {textArr.map((item, index) => (
        <SwiperSlide key={index}>
          <Flex justify="space-between" h="full" w="full" align="center">
            <Flex align="center" lineHeight="20px" mt="1px">
              <Box position="relative" fontWeight="bold">
                {item.name}
              </Box>
              <Box lineHeight="12px" color="#FF0000" ml={0.5} fontSize="10px" fontWeight="bold">
                NEW
              </Box>
            </Flex>
            <Flex align="center" lineHeight="18px">
              <Box color="#009388" fontWeight="bold" fontSize="12px" mr={1} mt="1px">
                {item.gift}
              </Box>
              <Box>
                <ShortArrowIcon dir="right" color="black" />
              </Box>
            </Flex>
          </Flex>
        </SwiperSlide>
      ))}
    </StyledSwiper>
  );
}

const StyledSwiper = styled(Swiper)<{ index: number }>`
  .swiper-pagination-bullet {
    background-color: white;
    width: 4px;
    height: 4px;
    opacity: 0.8;
  }
  .swiper-pagination {
    display: none; /* ✅ 페이지네이션 점 숨기기 */
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

export default TextSlider;
