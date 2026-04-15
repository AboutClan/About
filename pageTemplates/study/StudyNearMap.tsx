import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import SectionHeader from "../../components/atoms/SectionHeader";
import VoteMap from "../../components/organisms/VoteMap";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useCheckGuest } from "../../hooks/custom/UserHooks";
import { useStudyPlaceChangeMutation } from "../../hooks/study/mutations";
import { useStudyNearPlaceQuery } from "../../hooks/study/queries";
import { getMapOptions, getStudyPlaceMarkersOptions } from "../../libs/study/setStudyMapOptions";
import { ModalLayout } from "../../modals/Modals";
import { CoordinatesProps } from "../../types/common";
import { IMapOptions } from "../../types/externals/naverMapTypes";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { getTodayStr } from "../../utils/dateTimeUtils";
import PlaceInfoDrawer from "../studyPage/PlaceInfoDrawer";
import StudyPageMap from "../studyPage/studyPageMap/StudyPageMap";
import { ExpansionIcon, XIcon } from "../studyPage/studyPageMap/TopNav";

interface StudyNearMapProps {
  centerPlace: StudyPlaceProps;
  defaultLocation: CoordinatesProps;
  placeId: string;
}

function StudyNearMap({ centerPlace, placeId, defaultLocation }: StudyNearMapProps) {
  const router = useRouter();
  const resetStudy = useResetStudyQuery();
  const toast = useToast();
  const isGuest = useCheckGuest();
  const typeToast = useTypeToast();
  const { data } = useStudyNearPlaceQuery(centerPlace?._id, { enabled: !!centerPlace?._id });

  const [isMapExpansion, setIsMapExpansion] = useState(false);

  const [mapOptions, setMapOptions] = useState<IMapOptions>();
  const [placeInfo, setPlaceInfo] = useState<StudyPlaceProps>();
  const [isModal, setIsModal] = useState(false);
  const [isCafeMap, setIsCafeMap] = useState(false);

  useEffect(() => {
    setMapOptions(
      getMapOptions(
        { lat: centerPlace.location.latitude, lon: centerPlace.location.longitude },
        15,
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

  const { mutate } = useStudyPlaceChangeMutation(placeId, {
    onSuccess(_, param) {
      setIsCafeMap(false);
      resetStudy();
      toast("success", "변경 완료");
      setTimeout(() => {
        router.push(`/study/${param?.placeId}/${getTodayStr()}?type=results`);
      }, 800);
    },
  });

  return (
    <>
      {data?.length > 1 && (
        <Box px={5} mt={5}>
          <SectionHeader
            title="근처에 있는 카공하기 좋은 카페"
            subTitle="카공 멤버들과 상의해서 스터디 장소를 변경할 수 있어요."
          ></SectionHeader>
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
              border="1px solid var(--gray-200)"
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
                  <Button
                    p={0}
                    w="48px"
                    h="48px"
                    bg="white"
                    onClick={() => setIsMapExpansion(false)}
                  >
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
          <Button
            mt={4}
            borderRadius={8}
            color="mint"
            border="1px solid var(--color-mint)"
            bg="white"
            w="full"
            onClick={() => {
              if (isGuest) {
                typeToast("guest");
                return;
              }
              setIsModal(true);
            }}
          >
            스터디 장소 변경하기
          </Button>
        </Box>
      )}
      {isModal && (
        <ModalLayout
          title="스터디 장소 변경"
          setIsModal={setIsModal}
          footerOptions={{
            main: {
              text: "장소 변경",
              func: () => {
                setIsCafeMap(true);
                setIsModal(false);
              },
            },
            sub: { text: "취 소" },
          }}
        >
          <Box as="p">
            참여 멤버들과 <b>협의가 된 상황</b>에서 변경이 가능합니다. 일방적으로 스터디 장소를
            변경하여 피해가 발생하면 패널티가 부여될 수 있습니다.
          </Box>
        </ModalLayout>
      )}
      {isCafeMap && (
        <StudyPageMap
          handleVotePick={(place: StudyPlaceProps) => {
            mutate({ placeId: place._id });
          }}
          isDefaultOpen
          onClose={() => setIsCafeMap(false)}
          isCafeMap={false}
          defaultLocation={defaultLocation}
        />
      )}
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
