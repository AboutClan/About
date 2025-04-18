import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";

import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { LocationDotIcon, LocationDotIconHTML } from "../../components/Icons/LocationIcons";
import VoteMap from "../../components/organisms/VoteMap";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
interface StudyAddressMapProps {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

function StudyAddressMap({ latitude, longitude, address, name }: StudyAddressMapProps) {
  const mapOptions: IMapOptions = {
    center: new naver.maps.LatLng(latitude, longitude),
    zoom: 15,
    minZoom: 12,
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
    draggable: false, // 지도 드래그 비활성화
    scrollWheel: false, // 스크롤 휠 줌 비활성화
    keyboardShortcuts: false, // 키보드로 지도 조작 비활성화
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
        <Link href={`https://map.naver.com/v5/search/${address}`}>
          <Button variant="unstyled">
            <ShortArrowIcon dir="right" />
          </Button>
        </Link>
      </Flex>
      <Flex mb={4} align="center" fontSize="12px">
        <LocationDotIcon size="md" />
        <Box color="gray.500" as="span" ml={1}>
          {address}
        </Box>
      </Flex>
      <Box aspectRatio={1.85 / 1} borderRadius="8px" overflow="hidden">
        <VoteMap mapOptions={mapOptions} markersOptions={markersOptions} circleCenter={null} />
      </Box>
    </Box>
  );
}

export default StudyAddressMap;
