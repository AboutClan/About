import { Box, Button, Flex } from "@chakra-ui/react";

import { ShortArrowIcon } from "@/components/Icons/ArrowIcons";
import { LocationDotIcon, LocationDotIconHTML } from "@/components/Icons/LocationIcons";
import VoteMap from "@/components/organisms/VoteMap";
import { ExpansionIcon } from "@/features/studyMap/components/TopNav";
import { LocationProps } from "@/types/common";
import { IMapOptions, IMarkerOptions } from "@/types/externals/naverMapTypes";
import { navigateExternalLink } from "@/utils/navigateUtils";
interface StudyAddressMapProps {
  location: LocationProps;
}

function StudyAddressMap({
  location: { latitude, longitude, address, name },
}: StudyAddressMapProps) {
  const openNaverMap = () => navigateExternalLink(`https://map.naver.com/p/search/${name}`);

  const mapOptions: IMapOptions = {
    center: new naver.maps.LatLng(latitude, longitude),
    zoom: 15,
    minZoom: 12,
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  };

  const markersOptions: IMarkerOptions[] = [
    {
      position: new naver.maps.LatLng(latitude, longitude),
      title: name,
      shape: { type: "rect", coords: [-5, -5, 30, 30] },
      icon: {
        content: LocationDotIconHTML(name),
        anchor: new naver.maps.Point(16, 16),
      },
    },
  ];

  return (
    <Box mt={5}>
      <Flex mb={1} align="center" justify="space-between">
        <Box fontWeight="bold" fontSize="18px">
          길찾기
        </Box>

        <Button
          variant="unstyled"
          onClick={openNaverMap}
        >
          <ShortArrowIcon dir="right" />
        </Button>
      </Flex>
      <Flex mb={4} align="center" fontSize="12px">
        <LocationDotIcon size="md" />
        <Box color="gray.500" as="span" ml={1}>
          {address}
        </Box>
      </Flex>
      <Box aspectRatio={1.85 / 1} borderRadius="8px" overflow="hidden" pos="relative">
        {/*
          지도가 터치를 잡으면 그 위에서 위아래로 밀 때 페이지 대신 지도가 끌려간다.
          터치를 꺼서 페이지 스크롤로 넘기고, 크게 보기는 오른쪽 위 버튼(네이버 지도)으로 연다.
        */}
        <Box w="100%" h="100%" pointerEvents="none">
          <VoteMap mapOptions={mapOptions} markersOptions={markersOptions} />
        </Box>
        <Flex
          as="button"
          type="button"
          aria-label="지도 크게 보기"
          pos="absolute"
          top={3}
          right={3}
          zIndex={10}
          w="32px"
          h="32px"
          align="center"
          justify="center"
          bg="white"
          borderRadius="6px"
          border="var(--border-main)"
          boxShadow="0 1px 4px rgba(0, 0, 0, 0.12)"
          onClick={openNaverMap}
        >
          <ExpansionIcon />
        </Flex>
      </Box>
    </Box>
  );
}

export default StudyAddressMap;
