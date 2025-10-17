import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import SectionHeader from "../../components/atoms/SectionHeader";
import VoteMap from "../../components/organisms/VoteMap";
import { useStudyNearPlaceQuery } from "../../hooks/study/queries";
import { getMapOptions, getStudyPlaceMarkersOptions } from "../../libs/study/setStudyMapOptions";
import { IMapOptions } from "../../types/externals/naverMapTypes";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import PlaceInfoDrawer from "../studyPage/PlaceInfoDrawer";
import { ExpansionIcon, XIcon } from "../studyPage/studyPageMap/TopNav";

interface StudyNearMapProps {
  centerPlace: StudyPlaceProps;
}

function StudyNearMap({ centerPlace }: StudyNearMapProps) {
  const { data } = useStudyNearPlaceQuery(centerPlace?._id, { enabled: !!centerPlace?._id });

  const [isMapExpansion, setIsMapExpansion] = useState(false);

  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [placeInfo, setPlaceInfo] = useState<StudyPlaceProps>();

  useEffect(() => {
    setMapOptions(
      getMapOptions(
        { lat: centerPlace.location.latitude, lon: centerPlace.location.longitude },
        14,
      ),
    );
  }, [centerPlace]);

  const markersOptions = getStudyPlaceMarkersOptions(data, centerPlace._id, null);

  const handleMarker = (id: string, currentZoom: number) => {
    setMapOptions({ ...mapOptions, zoom: currentZoom });

    const findPlace = data?.find((place) => place._id === id);

    setPlaceInfo(findPlace);
    return;
  };

  return (
    <>
      <Box px={5} mt={10} mb={10}>
        <Box fontSize="18px" mb={4} fontWeight="bold"></Box>
        <SectionHeader
          title="근처에 있는 카공하기 좋은 카페"
          subTitle="카공 멤버들과 상의해서 스터디 장소를 변경할 수 있어요."
        >
          {/* <ButtonWrapper size="sm" url={`/studyPage?date=${dayjsToStr(dayjs())}`}>
          <ShortArrowIcon dir="right" />
        </ButtonWrapper> */}
        </SectionHeader>
        <Box mt={3}>
          <Box
            top={0}
            left={0}
            {...(!isMapExpansion
              ? { aspectRatio: 2 / 1, height: "inherit" }
              : { height: "100dvh" })}
            position={isMapExpansion ? "fixed" : "relative"}
            w="full"
            zIndex={isMapExpansion ? 1000 : 100}
            borderRadius="12px"
            overflow="hidden"
          >
            <Flex pos="absolute" top={2} right={2} zIndex={500}>
              {!isMapExpansion ? (
                <Button
                  borderRadius="4px"
                  bgColor="white"
                  boxShadow="0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
                  w="32px"
                  h="32px"
                  size="sm"
                  p="0"
                  border="var(--border-main)"
                  onClick={() => setIsMapExpansion(true)}
                >
                  <ExpansionIcon />
                </Button>
              ) : (
                <Button p={0} w="48px" h="48px" bg="white" onClick={() => setIsMapExpansion(false)}>
                  <XIcon />
                </Button>
              )}
            </Flex>
            <VoteMap
              mapOptions={mapOptions}
              markersOptions={markersOptions}
              resizeToggle={isMapExpansion}
              handleMarker={handleMarker}
              circleCenter={[
                { lat: centerPlace.location.latitude, lon: centerPlace.location.longitude },
              ]}
            />
          </Box>
        </Box>
      </Box>
      {placeInfo && (
        <PlaceInfoDrawer
          handleVotePick={null}
          placeInfo={placeInfo}
          onClose={() => setPlaceInfo(null)}
        />
      )}
    </>
  );
}

export default StudyNearMap;
