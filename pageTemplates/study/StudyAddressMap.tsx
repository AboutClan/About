import { Box, Button, Flex } from "@chakra-ui/react";

import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { LocationDotIcon, LocationDotIconHTML } from "../../components/Icons/LocationIcons";
import VoteMap from "../../components/organisms/VoteMap";
import { LocationProps } from "../../types/common";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
import { navigateExternalLink } from "../../utils/navigateUtils";
interface StudyAddressMapProps {
  location: LocationProps;
}

function StudyAddressMap({
  location: { latitude, longitude, address, name },
}: StudyAddressMapProps) {
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
          onClick={() => {
            navigateExternalLink(`https://map.naver.com/p/search/${name}`);
          }}
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
      <Box aspectRatio={1.85 / 1} borderRadius="8px" overflow="hidden">
        <VoteMap mapOptions={mapOptions} markersOptions={markersOptions} />
      </Box>
    </Box>
  );
}

export default StudyAddressMap;
