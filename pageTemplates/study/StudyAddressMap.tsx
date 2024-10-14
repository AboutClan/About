import { Box, Button, Flex } from "@chakra-ui/react";
import { renderToString } from "react-dom/server";
import LocationDot from "../../components/atoms/LocationDot";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import VoteMap from "../../components/organisms/VoteMap";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
interface StudyAddressMapProps {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

function StudyAddressMap({ latitude, longitude, address, name }: StudyAddressMapProps) {
  const infoWindowContent = renderToString(<LocationDot name="테스트" />);

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
      icon: { content: infoWindowContent, anchor: new naver.maps.Point(16, 16) },

      // infoWindow: {
      //   borderWidth: 1,
      //   disableAnchor: false,
      //   backgroundColor: "var(--gray-100)",
      //   borderColor: "var(--gray-600)",
      //   anchorSize: new naver.maps.Size(10, 10),
      //   anchorColor: "var(--gray-100)",
      // },
    },
  ];

  return (
    <Box>
      <Flex justify="space-between">
        <Box fontWeight="bold">길찾기</Box>
        <Button variant="unstyled">
          <ShortArrowIcon dir="right" />
        </Button>
      </Flex>

      <Box aspectRatio={1 / 1.85}>
        <VoteMap mapOptions={mapOptions} markersOptions={markersOptions} />
      </Box>
    </Box>
  );
}

export default StudyAddressMap;
