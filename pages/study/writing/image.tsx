import { Box } from "@chakra-ui/react";
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
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedStudyWritingState } from "../../../recoils/sharedDataAtoms";

function WritingStudyImage() {
  const router = useRouter();
  const failToast = useFailToast();

  const [studyWriting, setStudyWriting] = useRecoilState(sharedStudyWritingState);

  const [imageProps, setImageProps] = useState<{ mainImage: string; coverImage: string }>({
    mainImage: studyWriting?.image,
    coverImage: studyWriting?.coverImage,
  });

  const onClickNext = () => {
    if (!imageProps?.mainImage || !imageProps?.coverImage) {
      failToast("free", "내용을 작성해 주세요!", true);
      return;
    }
    setStudyWriting((old) => ({
      ...old,
      image: imageProps.mainImage,
      coverImage: imageProps.coverImage,
    }));
    router.push(`/study/writing/complete`);
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
        <ProgressStatus value={75} />
        <Header isSlide={false} title="" url="/study/writing/content" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>메인 이미지로 등록할 사진을 선택해 주세요!</span>
        </RegisterOverview>

        <Box p="12px 16px" borderBottom="var(--border)">
          <ImageBasicSlider
            selectedImageUrl={imageProps?.mainImage}
            imageTileArr={mainImageArr}
            size="sm"
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
          />
        </Box>
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} />
    </>
  );
}

export default WritingStudyImage;
