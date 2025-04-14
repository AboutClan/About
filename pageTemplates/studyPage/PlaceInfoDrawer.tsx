import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import Avatar from "../../components/atoms/Avatar";
import { LocationDotIcon } from "../../components/Icons/LocationIcons";
import NewTwoButtonRow from "../../components/molecules/NewTwoButtonRow";
import PlaceImage from "../../components/molecules/PlaceImage";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { StudyPlaceProps } from "../../types/models/studyTypes/baseTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";

interface PlaceInfoDrawerProps {
  placeInfo: StudyPlaceProps;
  onClose: () => void;
}

function PlaceInfoDrawer({ placeInfo, onClose }: PlaceInfoDrawerProps) {
  const typeToast = useTypeToast();
  const user = placeInfo?.registrant;
  return (
    <>
      <BottomFlexDrawer
        isDrawerUp
        isOverlay
        isHideBottom
        zIndex={900}
        height={210}
        setIsModal={onClose}
      >
        <Flex direction="column" w="100%">
          <Flex justifyContent="space-between" mb={4}>
            <Flex direction="column">
              <Box fontSize="18px" lineHeight="28px" fontWeight={600}>
                {placeInfo.fullname}
              </Box>
              <Flex align="center" fontSize="11px" mt={1}>
                <Box mr={1}>
                  <LocationDotIcon size="md" />
                </Box>
                <Box color="var(--gray-600)">{placeInfo.locationDetail}</Box>
                <Box as="span" color="var(--gray-400)">
                  ・
                </Box>
                <Box color="var(--color-blue)">좋아요 {placeInfo?.prefCnt}개</Box>
              </Flex>
              <Box mt={2} fontSize="11px" as="span" color="gray.500" lineHeight="12px">
                등록일: {dayjsToFormat(dayjs(placeInfo?.registerDate), "YYYY년 M월 D일")}
              </Box>
              <Flex mt={2} align="center">
                <Avatar {...user} size="xs" />
                <Box ml={1} fontSize="12px" color="var(--gray-600)">
                  {user?.name || "어바웃"}님 Pick
                </Box>
              </Flex>
            </Flex>
            <PlaceImage imageProps={{ image: placeInfo?.image }} size="lg" hasToggleHeart />
          </Flex>
          <Box py={2}>
            <NewTwoButtonRow
              leftProps={{
                icon: (
                  <i className="fa-solid fa-circle-info" style={{ color: "var(--gray-400)" }} />
                ),
                func: () => {
                  typeToast("inspection");
                },
                children: "정보 수정 요청",
              }}
              rightProps={{
                icon: <i className="fa-solid fa-comment-quote fa-flip-horizontal" />,
                func: () => {
                  typeToast("inspection");
                },
                children: <div>네이버 후기</div>,
              }}
            />
          </Box>
        </Flex>
      </BottomFlexDrawer>
    </>
  );
}

export default PlaceInfoDrawer;
