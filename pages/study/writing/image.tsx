import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";

import { STUDY_COVER_IMAGES } from "../../../assets/images/studyCover";
import { STUDY_MAIN_IMAGES } from "../../../assets/images/studyMain";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import ImageBasicSlider from "../../../components/organisms/sliders/ImageBasicSlider";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudyAdditionMutation } from "../../../hooks/study/mutations";
import { getStudyViewDate } from "../../../libs/study/date/getStudyDateStatus";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedStudyWritingState } from "../../../recoils/sharedDataAtoms";

function WritingStudyImage() {
  const router = useRouter();
  const toast = useToast();

  const [studyWriting, setStudyWriting] = useRecoilState(sharedStudyWritingState);

  const [imageProps, setImageProps] = useState<{ mainImage: string; coverImage: string }>({
    mainImage: studyWriting?.image,
    coverImage: studyWriting?.coverImage,
  });

  const { mutate } = useStudyAdditionMutation({
    onSuccess() {
      setStudyWriting(null);
      toast("success", "등록되었습니다.");
      router.push(`/studyPage?date=${getStudyViewDate(dayjs())}`);
    },
  });

  const onClickNext = () => {
    if (!imageProps?.mainImage || !imageProps?.coverImage) {
      
      toast("warning", "이미지를 선택해 주세요.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content, ...placeInfo } = studyWriting;

    mutate({ ...placeInfo, image: imageProps.mainImage, coverImage: imageProps.coverImage });
  };

  const mainImageArr = STUDY_MAIN_IMAGES.map((item) => ({
    imageUrl: item,
    func: () => {
      setImageProps((old) => ({ ...old, mainImage: item }));
    },
  }));
  const coverImageArr = STUDY_COVER_IMAGES.map((item) => ({
    imageUrl: item,
    func: () => {
      setImageProps((old) => ({ ...old, coverImage: item }));
    },
  }));

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={100} />
        <Header isSlide={false} title="" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>메인 이미지로 등록할 사진을 선택해 주세요!</span>
        </RegisterOverview>

        <Box p="12px 0" borderBottom="var(--border)">
          <ImageBasicSlider
            selectedImageUrl={imageProps?.mainImage}
            imageTileArr={mainImageArr}
            size="md"
            hasTextSkeleton={false}
          />
        </Box>
        <RegisterOverview>
          <span>커버 이미지로 등록할 사진을 선택해 주세요!</span>
        </RegisterOverview>

        <Box borderBottom="var(--border)">
          <ImageBasicSlider
            selectedImageUrl={imageProps?.coverImage}
            imageTileArr={coverImageArr}
            size="full"
            aspect={2}
            hasTextSkeleton={false}
          />
        </Box>
      </RegisterLayout>
      <BottomNav text="완 료" onClick={() => onClickNext()} />
    </>
  );
}

export default WritingStudyImage;
