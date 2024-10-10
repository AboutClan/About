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
import { getMyStudyVoteInfo } from "../../../libs/study/getMyStudy";
import {
  myRealStudyInfoState,
  myStudyInfoState,
  studyAttendInfoState,
} from "../../../recoils/studyRecoils";
import { KakaoLocationProps } from "../../../types/externals/kakaoLocationSearch";

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

  const [studyAttendInfo, setStudyAttendInfo] = useRecoilState(studyAttendInfoState);

  const myStudyInfo = useRecoilValue(myStudyInfoState);
  const myRealStudyInfo = useRecoilValue(myRealStudyInfoState);
  const myStudy = getMyStudyVoteInfo(myStudyInfo, session?.user.uid);

  useEffect(() => {
    if (studyAttendInfo) {
      const { text, lat, lon } = studyAttendInfo.place;
      setPlaceInfo({
        place_name: text,
        x: lon + "",
        y: lat + "",
      });
      setImage(studyAttendInfo?.image as Blob);
    }
  }, [studyAttendInfo]);

  useEffect(() => {
    if (myRealStudyInfo) {
      setPlaceInfo((old) => ({ ...old, place_name: myRealStudyInfo.place.text }));
      setIsActive(false);
    }
    if (myStudyInfo) {
      setPlaceInfo((old) => ({ ...old, place_name: myStudy?.fullname }));
      setIsActive(false);
    }
  }, [myStudyInfo, myRealStudyInfo]);

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

    setStudyAttendInfo((old) => ({
      ...old,
      image,
      place: {
        lat: +placeInfo?.y,
        lon: +placeInfo?.x,
        locationDetail: placeInfo?.road_address_name,
        text: placeInfo?.place_name,
      },
    }));
  };

  const handleResetButton = () => {
    if (myStudyInfo || myRealStudyInfo) {
      setIsResetAlert(true);
      return;
    }
    setPlaceInfo({ place_name: "", road_address_name: "" });
    setIsActive(true);
  };
  console.log(myStudy, myRealStudyInfo);
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
