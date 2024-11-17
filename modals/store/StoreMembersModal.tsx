import "swiper/css/autoplay";
import "swiper/css/pagination";

import { useState } from "react";
import styled from "styled-components";
import SwiperCore from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { IModal } from "../../types/components/modalTypes";
import { ModalLayout } from "../Modals";

import { Box, Flex } from "@chakra-ui/react";
import { Scrollbar } from "swiper/modules";
import { IStoreApplicant } from "../../types/models/store";

SwiperCore.use([Scrollbar]);

interface StoreMembersModalProps extends IModal {
  members: IStoreApplicant[];
}

function StoreMembersModal({ setIsModal, members }: StoreMembersModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const chunkArray = (arr: IStoreApplicant[], size: number) => {
    const result: IStoreApplicant[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const arr = chunkArray(members, 5);

  return (
    <ModalLayout setIsModal={setIsModal}>
      <StyledSwiper
        navigation
        index={currentSlide + 1}
        pagination={true}
        modules={[Pagination]}
        scrollbar={{ draggable: true, el: ".swiper-scrollbar" }}
        style={{
          width: "100%",
          height: "auto",
          position: "relative",
        }}
        slidesPerView={1}
        onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
      >
        {arr.map((memberArr, index) => (
          <SwiperSlide key={index}>
            <Box>
              <Flex direction="column">
                {memberArr.map((member) => (
                  <Flex
                    lineHeight="12px"
                    justify="space-between"
                    fontSize="10px"
                    fontWeight="semibold"
                    pb={2}
                    mb={2}
                  >
                    <Box color="mint">
                      {member.name[0]}*{member.name?.[1]}
                    </Box>
                    <Box>{member.cnt}회</Box>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </ModalLayout>
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

export default StoreMembersModal;
