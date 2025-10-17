import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import StarRating from "../../components/atoms/StarRating";
import NewTwoButtonRow from "../../components/molecules/NewTwoButtonRow";
import PlaceImage from "../../components/molecules/PlaceImage";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";

interface PlaceInfoDrawerProps {
  placeInfo: StudyPlaceProps;
  onClose: () => void;
  handleVotePick?: () => void;
}

function PlaceInfoDrawer({ placeInfo, onClose, handleVotePick }: PlaceInfoDrawerProps) {
  const typeToast = useTypeToast();

  return (
    <>
      <BottomFlexDrawer
        isDrawerUp
        isOverlay
        isHideBottom
        zIndex={2000}
        height={!handleVotePick ? 202 : 258}
        setIsModal={onClose}
      >
        <Flex direction="column" w="100%">
          <Flex justifyContent="space-between">
            <Flex direction="column" mr={2}>
              <Box
                fontSize="18px"
                lineHeight="28px"
                fontWeight={600}
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
                maxW="60dvw"
              >
                {placeInfo.location.name}
              </Box>
              <Flex align="center" fontSize="11px" mt={1}>
                {/* <Box mr={1} as="span">
                  <LocationDotIcon size="md" />
                </Box> */}
                {/* <Box
                  color="var(--gray-600)"
                  as="span"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  maxW="140px"
                >
                  {placeInfo.location.address}
                </Box> */}

                {/* <Box>4.5</Box> */}
                <Flex align="center">
                  <StarRating rating={placeInfo?.rating} size="md" />
                </Flex>
              </Flex>
              <Box mt={2} fontSize="11px" as="span" color="gray.500" lineHeight="12px">
                등록일: {dayjsToFormat(dayjs(placeInfo?.registerDate), "YYYY년 M월 D일")}
              </Box>
              <Flex mt={2} align="center" fontSize="12px" color="gray.600">
                한 줄 메모 기능 준비중...
                {/* <Avatar user={user} size="xs1" />
                <Box ml={1} fontSize="12px" color="var(--gray-600)">
                  {user?.name || "어바웃"}님 Pick
                </Box> */}
              </Flex>
            </Flex>
            <Box>
              <PlaceImage
                imageProps={{ image: placeInfo?.image || getRandomImage(STUDY_MAIN_IMAGES) }}
                size="lg"
                hasToggleHeart
              />
            </Box>
          </Flex>
          <Box py={2}>
            <NewTwoButtonRow
              leftProps={{
                icon: (
                  <Box mb="2px">
                    <InfoIcon />
                  </Box>
                ),
                func: () => {
                  navigateExternalLink(`https://map.naver.com/p/search/${placeInfo.location.name}`);
                },

                children: <Box mr="2px">네이버 리뷰</Box>,
              }}
              rightProps={{
                icon: (
                  <Box mb="2px">
                    <QuoteIcon />
                  </Box>
                ),
                func: () => {
                  typeToast("not-yet");
                },
                children: <Box mr="2px">멤버 리뷰</Box>,
              }}
            />
          </Box>
          {handleVotePick && (
            <Button colorScheme="black" size="lg" onClick={handleVotePick}>
              이 장소로 스터디 개설
            </Button>
          )}
        </Flex>
      </BottomFlexDrawer>
    </>
  );
}

export default PlaceInfoDrawer;

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--color-mint)"
    >
      <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="white"
    >
      <path d="m228-240 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T458-480L320-240h-92Zm360 0 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T818-480L680-240h-92ZM320-500q25 0 42.5-17.5T380-560q0-25-17.5-42.5T320-620q-25 0-42.5 17.5T260-560q0 25 17.5 42.5T320-500Zm360 0q25 0 42.5-17.5T740-560q0-25-17.5-42.5T680-620q-25 0-42.5 17.5T620-560q0 25 17.5 42.5T680-500Zm0-60Zm-360 0Z" />
    </svg>
  );
}
