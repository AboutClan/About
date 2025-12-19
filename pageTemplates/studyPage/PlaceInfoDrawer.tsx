import { Box, Button, Flex, Grid } from "@chakra-ui/react";

import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
import StarRating from "../../components/atoms/StarRating";
import { StarIcon } from "../../components/Icons/StarIcon";
import NewTwoButtonRow from "../../components/molecules/NewTwoButtonRow";
import PlaceImage from "../../components/molecules/PlaceImage";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { getRandomImage } from "../../utils/imageUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";

interface PlaceInfoDrawerProps {
  placeInfo: StudyPlaceProps;
  onClose: () => void;
  handleVotePick?: () => void;
  isDown?: boolean;
}

function PlaceInfoDrawer({ placeInfo, onClose, handleVotePick, isDown }: PlaceInfoDrawerProps) {
  return (
    <>
      <BottomFlexDrawer
        isDrawerUp
        isOverlay
        isHideBottom
        zIndex={2000}
        height={!handleVotePick ? 213 : 269}
        setIsModal={onClose}
      >
        <PlaceInfoBox placeInfo={placeInfo} isDown={isDown} handleVotePick={handleVotePick} />
      </BottomFlexDrawer>
    </>
  );
}

export default PlaceInfoDrawer;

export function PlaceInfoBox({
  placeInfo,
  isDown,
  handleVotePick,
}: {
  placeInfo: StudyPlaceProps;
  isDown: boolean;
  handleVotePick?: () => void;
}) {
  const userInfo = useUserInfo();
  const typeToast = useTypeToast();
  const toast = useToast();

  const isGuest = userInfo?.role === "guest";
  const reviewCnt = Math.ceil(Math.random() * 30);

  const a =
    placeInfo.location.name === "셀렉티드닉스"
      ? {
          a: 5,
          b: 5,
          c: 4.5,
          d: 5,
          e: 5,
          f: 31,
        }
      : {
          a: 4.5,
          b: 3,
          c: 4.5,
          d: 4,
          e: 4,
          f: 43,
        };

  return (
    <Flex direction="column" w="100%">
      <Flex justifyContent="space-between">
        <Flex direction="column" mr={2} w="full">
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
          <Flex mt={0.5} align="center">
            <Box>
              <StarRating rating={a.e} size="lg" />
            </Box>
            <Box fontWeight={600} fontSize="16px" mb="-2px" ml={1.5} mr={1}>
              {a.e?.toFixed(1)}
            </Box>
            <Box color="gray.500" fontSize="13px" mb="-2px">
              ({a.f})
            </Box>
          </Flex>
          <Grid
            gridTemplateColumns="repeat(2,1fr)"
            gridGap="4px"
            fontSize="12px"
            mt={2}
            bg="gray.100"
            w="full"
            px={3}
            py={2}
            borderRadius="8px"
            color="gray.800"
            mb={1}
          >
            <Flex>
              <Box w="56px">공부 분위기</Box>
              <Box mx="1px">
                <StarIcon type="empty" size="md" />
              </Box>
              {a.a?.toFixed(1)}
            </Flex>
            <Flex ml="-2px">
              <Box>콘센트/테이블</Box>
              <Box mx="1px">
                <StarIcon type="empty" size="md" />
              </Box>
              {a.b?.toFixed(1)}
            </Flex>
            <Flex>
              <Box w="56px">음료/가성비</Box>
              <Box mx="1px">
                <StarIcon type="empty" size="md" />
              </Box>
              {a.c?.toFixed(1)}
            </Flex>
            <Flex ml="-2px">
              기타
              <Box mx="1px">
                <StarIcon type="empty" size="md" />
              </Box>
              {a?.d?.toFixed(1)}
            </Flex>
          </Grid>
          {/* <Flex mt={2}>
            환경
            <Box mx="1px">
              <StarIcon type="empty" size="md" />
            </Box>
            4.0 | 콘센트
            <Box mx="1px">
              <StarIcon type="empty" size="md" />
            </Box>
            4.0 | 기타
            <Box mx="1px">
              <StarIcon type="empty" size="md" />
            </Box>
            4.5
          </Flex> */}
          {/* <Flex mt={2} align="center" fontSize="12px" color="gray.600">
            한 줄 메모 기능 준비중...
          </Flex> */}
        </Flex>
        <Box>
          <PlaceImage
            imageProps={{ image: placeInfo?.image || getRandomImage(STUDY_MAIN_IMAGES) }}
            size="md2"
            hasToggleHeart
            isDown={isDown}
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
              if (isDown || isGuest) {
                toast("info", "ABOUT 멤버만 이용할 수 있는 기능입니다.");
              } else typeToast("not-yet");
            },
            children: <Box mr="2px">별점 남기기</Box>,
          }}
        />
      </Box>
      {handleVotePick && (
        <Button mb={2} colorScheme="black" size="lg" onClick={handleVotePick}>
          이 장소로 스터디 개설
        </Button>
      )}
    </Flex>
  );
}

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
      <path d="M240-240 114-114q-10 10-22 5t-12-19v-672q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240Zm240-221 76 46q11 7 22-.5t8-20.5l-20-87 68-59q10-9 6-21.5T622-617l-89-7-35-82q-5-12-18-12t-18 12l-35 82-89 7q-14 1-18 13.5t6 21.5l68 59-20 87q-3 13 8 20.5t22 .5l76-46Z" />
    </svg>
  );
}
