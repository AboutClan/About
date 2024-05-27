import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";

import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import ImageTileSlider, { IImageTile } from "../../../components/organisms/sliders/ImageTileSlider";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedStudyWritingState } from "../../../recoils/sharedDataAtoms";
import { STORE_GIFT } from "../../../storage/Store";

function WritingStudyImage() {
  const router = useRouter();
  const failToast = useFailToast();

  const [studyWriting, setStudyWriting] = useRecoilState(sharedStudyWritingState);

  const [content, setContent] = useState(studyWriting?.content || "");

  const onClickNext = () => {
    if (!content) {
      failToast("free", "내용을 작성해 주세요!", true);
      return;
    }
    setStudyWriting((old) => ({
      ...old,

      content,
    }));
    router.push(`/study/writing/writingStudyImage`);
  };

  const imageArr: IImageTile[] = STORE_GIFT.map((item) => ({
    imageUrl: item.image,
  }));

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={40} />
        <Header isSlide={false} title="" url="/study/writing/place" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>메인 이미지로 등록할 사진을 선택해 주세요!</span>
        </RegisterOverview>

        <Box p="12px 16px" borderBottom="var(--border)">
          <ImageTileSlider imageTileArr={imageArr} size="sm" slidesPerView={3.4} />
        </Box>
      </RegisterLayout>
      <RegisterLayout>
        <RegisterOverview>
          <span>커버 이미지로 등록할 사진을 선택해 주세요!</span>
        </RegisterOverview>

        <Box p="12px 16px" borderBottom="var(--border)">
          <ImageTileSlider imageTileArr={imageArr} size="sm" slidesPerView={3.4} />
        </Box>
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} />
    </>
  );
}

export default WritingStudyImage;
