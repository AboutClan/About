import { Box, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import PageIntro from "../../../components/atoms/PageIntro";
import SectionTitle from "../../../components/atoms/SectionTitle";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ImageUploadInput from "../../../components/molecules/ImageUploadInput";
import LocationSearch from "../../../components/organisms/location/LocationSearch";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudySetQuery } from "../../../hooks/custom/StudyHooks";
import { NaverLocationProps } from "../../../hooks/external/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { transferStudyAttendanceState } from "../../../recoils/transferRecoils";

function Certification() {
  const { data: session } = useSession();
  const toast = useToast();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const type = searchParams.get("type") as "soloRealTimes";

  const { data: userInfo } = useUserInfoQuery();

  const { studySet } = useStudySetQuery(date, !!date && type === "soloRealTimes");

  const [image, setImage] = useState<Blob>();
  const [placeInfo, setPlaceInfo] = useState<NaverLocationProps>({
    title: "",
    address: "",
    lat: null,
    lng: null,
  });
  const [isActive, setIsActive] = useState(true);

  const [studyAttendanceRequest, setStudyAttendanceRequest] = useRecoilState(
    transferStudyAttendanceState,
  );
  console.log(1234, studyAttendanceRequest);
  useEffect(() => {
    if (studyAttendanceRequest) {
      const { name, latitude, longitude, address } = studyAttendanceRequest.place;
      setPlaceInfo({
        title: name,
        lng: longitude,
        lat: latitude,
        address,
      });
      setImage(studyAttendanceRequest?.image);
    } else if (type === "soloRealTimes" && studySet) {
      const findMyStudyResult = studySet["soloRealTimes"]?.find(
        (par) => par.study.user._id === userInfo?._id,
      );

      if (findMyStudyResult) {
        const studyPlace = findMyStudyResult.study.place;
        setPlaceInfo({
          lng: studyPlace.longitude,
          lat: studyPlace.latitude,
          address: studyPlace.address,
          title: studyPlace.name,
        });
        setIsActive(false);
      }
    }
  }, [studyAttendanceRequest, studySet, userInfo]);

  const handleBottomNav = (e) => {
    if (!image) {
      toast("warning", "이미지를 등록해 주세요");
      e.preventDefault();
      return;
    }
    if (!placeInfo?.title) {
      toast("warning", "장소를 입력해 주세요");
      e.preventDefault();
      return;
    }

    setStudyAttendanceRequest((old) => ({
      ...old,
      image,
      place: {
        latitude: placeInfo?.lat,
        longitude: placeInfo?.lng,
        address: placeInfo?.address,
        name: placeInfo?.title,
      },
    }));
  };

  const handleResetButton = () => {
    setPlaceInfo({ title: "", address: "", lat: null, lng: null });
    setIsActive(true);
  };

  return (
    <>
      <Box minH="calc(100dvh - var(--header-h))" bgColor="white">
        <Header title="" isBorder={false} />
        <Slide>
          <PageIntro
            main={{ first: type === "soloRealTimes" ? "개인 스터디 인증" : "출석 인증하기" }}
            sub="공부 사진을 인증해 주세요"
          />
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
    </>
  );
}

export default Certification;
