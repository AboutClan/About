import { Box, Flex } from "@chakra-ui/react";

import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { PlaceInfoBox } from "./PlaceInfoDrawer";

interface CafeListDrawerProps {
  onClose: () => void;
  placeData: StudyPlaceProps[];
  pickReviewPlace: (id: string) => void;
}

export function CafeListDrawer({ onClose, placeData, pickReviewPlace }: CafeListDrawerProps) {
  return (
    <>
      <BottomFlexDrawer
        isDrawerUp
        isOverlay
        height={643}
        isHideBottom
        zIndex={1000}
        setIsModal={onClose}
      >
        <Box
          pt={1}
          pb={0}
          lineHeight="32px"
          w="100%"
          fontWeight="semibold"
          fontSize="20px"
          textAlign="start"
        >
          내 인근 카공 카페
        </Box>{" "}
        <Box color="gray.500" mr="auto" fontSize="12px">
          3km 이내에 <b>{placeData?.length}개</b>의 카공 카페가 있어요!
        </Box>
        <Flex
          flexDir="column"
          w="full"
          mt={3}
          flex="1"
          minH={0}
          overflowY="auto"
          borderTop="var(--border-main)"
          borderTopWidth="2px"
          sx={{
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            touchAction: "auto",
            "& *": {
              touchAction: "auto", // ← 자식들까지 다 풀어버리기
            },
          }}
        >
          {placeData?.map((place, idx) => {
            return (
              <Box key={idx} borderBottom="var(--border-main)" py={3}>
                <PlaceInfoBox
                  placeInfo={place}
                  isDown={false}
                  isShort
                  handleClick={() => {
                    pickReviewPlace(place._id);
                  }}
                />
              </Box>
            );
          })}
        </Flex>
      </BottomFlexDrawer>
    </>
  );
}
