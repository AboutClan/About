import { Box, Button } from "@chakra-ui/react";
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
import { useKeypadHeight } from "../../../hooks/custom/useKeypadHeight";
import { NaverLocationProps } from "../../../hooks/external/queries";
import { useStudySetQuery } from "../../../hooks/study/queries";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { transferStudyAttendanceState } from "../../../recoils/transferRecoils";

function Certification() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const type = searchParams.get("type") as "soloRealTimes";

  const { data: userInfo } = useUserInfoQuery();

  const { data: studySet } = useStudySetQuery(date, {
    enabled: !!date && type === "soloRealTimes",
  });

  const [image, setImage] = useState<Blob>();
  const [placeInfo, setPlaceInfo] = useState<NaverLocationProps>({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });
  const [isActive, setIsActive] = useState(true);

  const [studyAttendanceRequest, setStudyAttendanceRequest] = useRecoilState(
    transferStudyAttendanceState,
  );

  useEffect(() => {
    if (studyAttendanceRequest) {
      setPlaceInfo(studyAttendanceRequest.place);
      setImage(studyAttendanceRequest?.image);
    } else if (type === "soloRealTimes" && studySet) {
      const findMyStudyResult = studySet["soloRealTimes"]?.find((par) =>
        par.study.members.some((member) => member.user._id === userInfo?._id),
      );

      if (findMyStudyResult) {
        const location = findMyStudyResult.study.place.location;
        setPlaceInfo(location);
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
        latitude: placeInfo?.latitude,
        longitude: placeInfo?.longitude,
        address: placeInfo?.address,
        name: placeInfo?.title,
      },
    }));
  };

  const handleResetButton = () => {
    setPlaceInfo({ title: "", address: "", latitude: null, longitude: null });
    setIsActive(true);
  };
  const keypadHeight = useKeypadHeight();
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    if (isFocus && keypadHeight) {
      window.scrollBy({ top: keypadHeight, behavior: "smooth" });
    }
  }, [isFocus]);

  return (
    <>
      <Box
        bgColor="white"
        mb={isFocus ? `${keypadHeight}px` : 0}
        minH="calc(100dvh - var(--header-h))"
      >
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
            setIsFocus={setIsFocus}
          />
        </Slide>
      </Box>
      <BottomNav url="/vote/attend/configuration" onClick={handleBottomNav} />
    </>
  );
}

export default Certification;
