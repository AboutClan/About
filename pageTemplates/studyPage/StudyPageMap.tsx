import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Slide from "../../components/layouts/PageSlide";

import VoteMap from "../../components/organisms/VoteMap";
import { useUserInfoQuery } from "../../hooks/user/queries";

import {
  getDetailInfo,
  getMapOptions,
  getMarkersOptions,
} from "../../libs/study/setStudyMapOptions";
import { findStudyByPlaceId } from "../../libs/study/studySelectors";

import { CoordinatesProps } from "../../types/common";
import { IMapOptions, IMarkerOptions } from "../../types/externals/naverMapTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import { StudyVoteDataProps } from "../../types/models/studyTypes/baseTypes";
import StudyInfoDrawer, { StudyInfoProps } from "./StudyInfoDrawer";
import StudyMapTopNav from "./StudyMapTopNav";

interface StudyPageMapProps {
  studyVoteData: StudyVoteDataProps;
  centerLocation: CoordinatesProps;
  currentLocation: CoordinatesProps;
  setCenterLocation: DispatchType<CoordinatesProps>;
  date: string;
  myVoteCoordinates: CoordinatesProps;
}

function StudyPageMap({
  studyVoteData,
  centerLocation,
  currentLocation,
  setCenterLocation,
  date,
  myVoteCoordinates,
}: StudyPageMapProps) {
  const router = useRouter();

  const { data: userInfo } = useUserInfoQuery();

  /* 네이버 지도와 마커 옵션 */
  const [mapOptions, setMapOptions] = useState<IMapOptions>(null);
  const [markersOptions, setMarkersOptions] = useState<IMarkerOptions[]>(null);
  const [isMapExpansion, setIsMapExpansion] = useState(false);
  const [detailInfo, setDetailInfo] = useState<StudyInfoProps>();

  useEffect(() => {
    if (!studyVoteData) return;

    const options = getMapOptions(centerLocation, isMapExpansion ? 12 : 13);
    setMapOptions(options);
    setMarkersOptions(
      getMarkersOptions(
        studyVoteData.results,
        studyVoteData?.realTimes?.userList || null,
        currentLocation,
        myVoteCoordinates,
        // studyVoteData?.participations,
      ),
    );
  }, [studyVoteData, currentLocation, centerLocation, isMapExpansion]);

  const handleMarker = (id: string, type: "vote") => {
    if (!id || !studyVoteData) return;

    const findStudy = studyVoteData && findStudyByPlaceId(studyVoteData, id);

    const detailInfo = getDetailInfo(findStudy, userInfo?.uid);
    setDetailInfo(detailInfo);
  };

  return (
    <>
      <Slide>
        <Box
          position={isMapExpansion ? "fixed" : "relative"}
          top={0}
          left={0}
          zIndex={700}
          height={isMapExpansion ? "100dvh" : 180}
          w="full"
          borderRadius="16px"
          overflow="hidden"
          border="1px solid black"
          borderColor="gray.200"
          bg="gray.100"
          onClick={() => (!isMapExpansion ? setIsMapExpansion(true) : null)}
        >
          <StudyMapTopNav
            handleLocationRefetch={() =>
              currentLocation ? setCenterLocation(currentLocation) : null
            }
            isRight={isMapExpansion}
          />
          <VoteMap
            mapOptions={mapOptions}
            markersOptions={markersOptions}
            resizeToggle={isMapExpansion}
            handleMarker={handleMarker}
            circleCenter={isMapExpansion ? studyVoteData?.results?.[0]?.center : null}
          />
          {/* {!studyVoteData?.results && <MainLoadingAbsolute />} */}
        </Box>
        {isMapExpansion && (
          <Button
            p={0}
            w="48px"
            h="48px"
            zIndex={700}
            position="fixed"
            top="20px"
            left="20px"
            bg="white"
            onClick={() => setIsMapExpansion(false)}
          >
            <XIcon />
          </Button>
        )}
      </Slide>
      {detailInfo && (
        <StudyInfoDrawer date={date} detailInfo={detailInfo} setDetailInfo={setDetailInfo} />
      )}
    </>
  );
}

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="var(--gray-900)"
  >
    <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
  </svg>
);

export default StudyPageMap;
