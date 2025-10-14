import "swiper/css/autoplay";
import "swiper/css/pagination";

import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";
import SwiperCore from "swiper";
import { Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { IModal } from "../../types/components/modalTypes";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { ModalLayout } from "../Modals";

SwiperCore.use([Scrollbar]);

interface StoreMembersModalProps extends IModal {
  members: { user: UserSimpleInfoProps; cnt: number }[];
}

function StoreMembersModal({ setIsModal, members }: StoreMembersModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const chunkArray = (arr: { user: UserSimpleInfoProps; cnt: number }[], size: number) => {
    const result: { user: UserSimpleInfoProps; cnt: number }[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const arr = chunkArray(members, 5);

  return (
    <ModalLayout title="참여 현황" footerOptions={{}} setIsModal={setIsModal}>
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
            <Flex
              borderRadius="8px"
              direction="column"
              bg="rgba(97,106,97,0.04)"
              border="1px solid F7F7F7"
              px={3}
              py={2}
              minH="160px"
            >
              {memberArr.map((member, idx) => (
                <Flex
                  key={idx}
                  lineHeight="12px"
                  justify="space-between"
                  fontSize="10px"
                  fontWeight="semibold"
                  pb={2}
                  mb={2}
                >
                  <Box color="mint">{member.user.name}</Box>
                  <Box color="gray.600">{member.cnt}회</Box>
                </Flex>
              ))}
              {arr.length === 1 && (
                <Box
                  opacity={0.6}
                  borderRadius="16px"
                  mt="auto"
                  mx="auto"
                  w={3}
                  h={1}
                  bg="mint"
                ></Box>
              )}
            </Flex>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </ModalLayout>
  );
}

const StyledSwiper = styled(Swiper)<{ index: number }>`
  overflow: hidden;

  .swiper-wrapper {
    display: -webkit-inline-box;
  }
  .swiper-pagination-bullet {
    background-color: var(--gray-400);
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
