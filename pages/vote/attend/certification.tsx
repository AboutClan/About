import { Box, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import AlertModal from "../../../components/AlertModal";
import PageIntro from "../../../components/atoms/PageIntro";
import SectionTitle from "../../../components/atoms/SectionTitle";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ImageUploadInput from "../../../components/molecules/ImageUploadInput";
import LocationSearch from "../../../components/organisms/location/LocationSearch";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudyVoteQuery } from "../../../hooks/study/queries";
import { findMyStudyByUserId } from "../../../libs/study/studySelectors";
import { transferStudyAttendanceState } from "../../../recoils/transferRecoils";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";

function Certification() {
  const { data: session } = useSession();
  const toast = useToast();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const { data: studyVoteData } = useStudyVoteQuery(date, { enabled: !!date });

  const [image, setImage] = useState<Blob>();
  const [placeInfo, setPlaceInfo] = useState<KakaoLocationProps>({
    place_name: "",
    road_address_name: "",
  });
  const [isResetAlert, setIsResetAlert] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [studyAttendanceRequest, setStudyAttendanceRequest] = useRecoilState(
    transferStudyAttendanceState,
  );
  console.log(studyAttendanceRequest, date);
  useEffect(() => {
    const findMyStudyResult = findMyStudyByUserId(studyVoteData, session?.user.id);

    if (studyAttendanceRequest) {
      const { name, latitude, longitude } = studyAttendanceRequest.place;
      setPlaceInfo({
        place_name: name,
        x: longitude + "",
        y: latitude + "",
      });
      setImage(studyAttendanceRequest?.image);
    } else if (findMyStudyResult) {
      const studyPlace = findMyStudyResult?.place;

      setPlaceInfo({
        x: studyPlace.longitude + "",
        y: studyPlace.latitude + "",
        road_address_name: studyPlace.address,
        place_name: studyPlace.name,
      });

      setIsActive(false);
    }
  }, [studyAttendanceRequest, studyVoteData, session]);

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
    setIsResetAlert(true);
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
