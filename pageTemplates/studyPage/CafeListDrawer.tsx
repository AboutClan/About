import { Box, Flex, IconButton } from "@chakra-ui/react";

import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { PlaceInfoBox } from "./PlaceInfoDrawer";
import { XIcon } from "./studyPageMap/TopNav";

interface CafeListDrawerProps {
  onClose: () => void;
  placeData: StudyPlaceProps[];
  pickReviewPlace: (place: StudyPlaceProps) => void;
  type: "ids" | "drawer" | "about";
  radiusKm?: number;
  pickNickname?: string;
}

export function CafeListDrawer({
  onClose,
  placeData,
  pickReviewPlace,
  type,
  radiusKm,
  pickNickname,
}: CafeListDrawerProps) {
  const formatRadius = (km: number) => {
    if (!Number.isFinite(km) || km <= 0) {
      return "100m";
    }

    // 최소 100m
    const meter = Math.max(100, Math.round(km * 1000));

    // 1km 미만이면 m 표시
    if (meter < 1000) {
      return `${meter}m`;
    }

    // 1km 이상이면 km 표시
    return `${Math.round(km)}km`;
  };

  return (
    <>
      <BottomFlexDrawer
        isDrawerUp
        isOverlay
        height={580}
        isHideBottom
        zIndex={1000}
        setIsModal={onClose}
        headerSlot={
          <>
            <Flex pt={1} pb={0} w="100%" align="center">
              <Box
                lineHeight="32px"
                flex="1"
                minW={0}
                fontWeight="semibold"
                fontSize="20px"
                textAlign="start"
              >
                {type === "about"
                  ? `${pickNickname ?? "어바웃"}님 PICK 카공 카페`
                  : type === "drawer"
                  ? "근처에 있는 카공 카페"
                  : "해당 위치 카공 카페"}
              </Box>
              <IconButton
                aria-label="닫기"
                icon={<XIcon />}
                variant="ghost"
                size="sm"
                ml={2}
                border="none"
                cursor="pointer"
                onClick={onClose}
              />
            </Flex>
            <Box color="gray.500" mr="auto" fontSize="12px">
              {type === "about" ? (
                <>
                  항상 자리 여유가 있는 <b>{placeData?.length}개</b>의 카공 카페
                </>
              ) : type === "drawer" ? (
                <>
                  반경 <b>{formatRadius(radiusKm ?? 0)}</b>에 <b>{placeData?.length}개</b>의 카공
                  카페가 있어요!
                </>
              ) : (
                <>
                  해당 위치에 <b>{placeData?.length}개</b>의 카공 카페가 있어요!
                </>
              )}
            </Box>
          </>
        }
      >
        <Flex
          flexDir="column"
          w="full"
          mt={3}
          flex="1"
          minH={0}
          overflowY="auto"
          borderTop="var(--border-main)"
          sx={{
            "::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            touchAction: "pan-y",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {placeData?.map((place) => {
            return (
              <Box key={place._id} borderBottom="var(--border-main)" pb={3} pt={1}>
                <PlaceInfoBox
                  placeInfo={place}
                  isDown={false}
                  isShort
                  handleClick={() => {
                    pickReviewPlace(place);
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
