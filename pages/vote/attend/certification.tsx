import { Box, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import AlertModal from "../../../components/AlertModal";
import PageIntro from "../../../components/atoms/PageIntro";
import SectionTitle from "../../../components/atoms/SectionTitle";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ImageUploadInput from "../../../components/molecules/ImageUploadInput";
import LocationSearch from "../../../components/organisms/location/LocationSearch";
import { useToast } from "../../../hooks/custom/CustomToast";
import { getLocationByCoordinates } from "../../../libs/study/getLocationByCoordinates";
import { myStudyParticipationState } from "../../../recoils/studyRecoils";
import { transferStudyAttendanceState } from "../../../recoils/transferRecoils";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";
import { StudyPlaceProps } from "../../../types/models/studyTypes/studyDetails";
import { PlaceInfoProps } from "../../../types/models/utilTypes";

function Certification() {
  const toast = useToast();
  const { data: session } = useSession();
  const [image, setImage] = useState<Blob>();
  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });

  const [imageArr, setImageArr] = useState<string[]>([]);
  const [imageFormArr, setImageFormArr] = useState<Blob[]>([]);
  const [isResetAlert, setIsResetAlert] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [studyAttendanceRequest, setStudyAttendanceRequest] = useRecoilState(
    transferStudyAttendanceState,
  );
  //  latitude: +placeInfo?.y,
  //       longitude: +placeInfo?.x,
  //       address: placeInfo?.road_address_name,
  //       name: placeInfo?.place_name,
  const myStudyParticipation = useRecoilValue(myStudyParticipationState);

  useEffect(() => {
    if (studyAttendanceRequest) {
      const { name, latitude, longitude } = studyAttendanceRequest.place;
      setPlaceInfo({
        place_name: name,
        x: longitude + "",
        y: latitude + "",
      });
      setImage(studyAttendanceRequest?.image);
    }
  }, [studyAttendanceRequest]);

  useEffect(() => {
    if (!myStudyParticipation) return;
    const studyPlace = myStudyParticipation?.place as StudyPlaceProps;
    const realTimePlace = myStudyParticipation?.place as PlaceInfoProps;

    setPlaceInfo((old) => ({
      ...old,
      x: (studyPlace?.longitude || realTimePlace?.longitude) + "",
      y: (studyPlace?.latitude || realTimePlace?.latitude) + "",
      road_address_name: studyPlace?.locationDetail || realTimePlace?.address,
      place_name:
        (myStudyParticipation?.place as StudyPlaceProps)?.fullname ||
        (myStudyParticipation?.place as PlaceInfoProps)?.name,
    }));

    setIsActive(false);

    setIsActive(false);
  }, [myStudyParticipation]);
  console.log(234, placeInfo);
  const handleBottomNav = (e) => {
    if (!image) {
      toast("warning", "이미지를 등록해 주세요");
      e.preventDefault();
      return;
    }
    if (!placeInfo?.place_name) {
      toast("warning", "장소를 입력해 주세요");
      e.preventDefault();
      return;
    }

    const changeLocation = getLocationByCoordinates(+placeInfo?.y, +placeInfo?.x);

    if (!changeLocation) {
      toast("warning", "서비스중인 지역이 아닙니다.");
      e.preventDefault();
      return;
    }

    setStudyAttendanceRequest((old) => ({
      ...old,
      image,
      place: {
        latitude: +placeInfo?.y,
        longitude: +placeInfo?.x,
        address: placeInfo?.road_address_name,
        name: placeInfo?.place_name,
      },
    }));
  };

  const handleResetButton = () => {
    if (myStudyParticipation) {
      setIsResetAlert(true);
      return;
    }
    setPlaceInfo({ place_name: "", road_address_name: "" });
    setIsActive(true);
  };

  return (
    <>
      <Box minH="calc(100dvh - var(--header-h))" bgColor="white">
        <Header title="" isBorder={false} />
        <Slide>
          <PageIntro main={{ first: "출석 인증하기" }} sub="스터디 출석을 인증해 보세요" />
          <ImageUploadInput setImageUrl={setImage} />
          <Box mb={3}>
            <SectionTitle text="현재 장소" isActive={isActive}>
              <Button
                fontSize="12px"
                fontWeight={500}
                size="xs"
                variant="ghost"
                height="20px"
                color="var(--color-blue)"
                rightIcon={<i className="fa-solid fa-arrows-rotate" />}
                onClick={handleResetButton}
              >
                초기화
              </Button>
            </SectionTitle>
          </Box>
          <LocationSearch
            info={placeInfo}
            setInfo={setPlaceInfo}
            isActive={isActive}
            hasInitialValue
          />
        </Slide>
      </Box>
      <BottomNav url="/vote/attend/configuration" onClick={handleBottomNav} />
      {isResetAlert && (
        <AlertModal
          options={{
            title: "스터디 장소 변경",
            subTitle: "장소를 변경하는 경우 기존에 투표 장소는 취소됩니다.",
            text: "변경합니다",
            func: () => {
              setPlaceInfo({ place_name: "", road_address_name: "" });
              setIsActive(true);
            },
          }}
          setIsModal={setIsResetAlert}
        />
      )}
    </>
  );
}

export default Certification;
