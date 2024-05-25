import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import InfoBox, { InfoBoxProp } from "../../components/molecules/InfoBox";
import VoteMap from "../../components/organisms/VoteMap";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";

interface IStudyOverview {
  title: string;
  time: string;
  locationDetail: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  participantsNum: number;
}

function StudyOverview({
  title,
  locationDetail,
  coordinate,
  time,
  participantsNum,
}: IStudyOverview) {
  const [isModal, setIsModal] = useState(false);

  const mapOptions: IMapOptions = {
    center: new naver.maps.LatLng(coordinate.lat, coordinate.lng),
    zoom: 15,
    minZoom: 12,
    mapTypeControl: false,
    scaleControl: false,
    logoControl: false,
    mapDataControl: false,
  };

  const markersOptions: IMarkerOptions[] = [
    {
      position: new naver.maps.LatLng(coordinate.lat, coordinate.lng),
      title: title,
      shape: { type: "rect", coords: [-5, -5, 30, 30] },
      infoWindow: {
        content: `<div style=" font-size:12px; padding:4px 6px"><span style="font-weight:600; color:#565B67;">${title}</span><br/><span>현재 신청 인원:<span style="color:#00c2b3; font-weight:500;"> ${participantsNum}명</span></span></div>`,
        borderWidth: 1,
        disableAnchor: false,
        backgroundColor: "var(--gray-100)",
        borderColor: "var(--gray-600)",
        anchorSize: new naver.maps.Size(10, 10),
        anchorColor: "var(--gray-100)",
      },
    },
  ];

  const infos: InfoBoxProp[] = [
    {
      text: locationDetail,
      icon: <i className="fa-solid fa-location-dot " />,
    },
    {
      text: time,
      icon: <i className="fa-solid fa-clock" />,
    },
  ];

  return (
    <>
      <OverviewWrapper>
        <Title>{title}</Title>
        <Flex mt="12px">
          <Box flex={1}>
            <InfoBox infos={infos} />
          </Box>
          <Button
            mt="2px"
            size="xs"
            backgroundColor="mint"
            color="white"
            leftIcon={<i className="fa-solid fa-location-dot fa-sm" />}
            onClick={() => setIsModal((old) => !old)}
            _focus={{
              backgroundColor: "var(--color-mint)",
            }}
            _active={{
              backgroundColor: "var(--color-mint)",
            }}
          >
            {isModal ? "지도 닫기" : "지도 보기"}
          </Button>
        </Flex>
      </OverviewWrapper>
      {isModal && (
        <MapWrapper>
          <VoteMap mapOptions={mapOptions} markersOptions={markersOptions} />
        </MapWrapper>
      )}
    </>
  );
}

const OverviewWrapper = styled.div`
  padding: 16px 16px;
  padding-bottom: 12px;
  background-color: white;
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 18px; /* 18px */
`;

const InfoContainer = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 2;
  font-size: 14px; /* 14px */
`;

const InfoIconText = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 14px; /* Adjusted from w-3.5 to actual px */
    margin-right: 8px;
    color: var(--gray-600); /* text-gray-3 */
  }
`;

const MapWrapper = styled.div`
  aspect-ratio: 1/1;
`;

export default StudyOverview;
