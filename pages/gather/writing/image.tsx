import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState } from "recoil";

import { GATHER_COVER_IMAGE, GATHER_MAIN_IMAGE } from "../../../assets/gather";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import ImageBasicSlider2 from "../../../components/organisms/sliders/ImageBasicSlider2";
import GatherWritingConfirmModal from "../../../modals/gather/GatherWritingConfirmModal";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherWriting } from "../../../types/models/gatherTypes/gatherTypes";

function GatherWritingImagePage() {
  const [gatherContent, setGatherContent] = useRecoilState(sharedGatherWritingState);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [imageProps, setImageProps] = useState<{ mainImage: string; coverImage: string }>({
    mainImage: gatherContent?.image,
    coverImage: gatherContent?.coverImage,
  });

  const mainImageArr = GATHER_MAIN_IMAGE.map((item) => ({
    imageUrl: item,
    func: () => {
      setImageProps((old) => ({ ...old, mainImage: item }));
    },
  }));
  const coverImageArr = GATHER_COVER_IMAGE.map((item) => ({
    imageUrl: item,
    func: () => {
      setImageProps((old) => ({ ...old, coverImage: item }));
    },
  }));

  const onClickNext = async () => {
    const gatherData: IGatherWriting = {
      ...gatherContent,
      image: imageProps.mainImage,
      coverImage: imageProps.coverImage,
    };
    setGatherContent(gatherData);
    setIsConfirmModal(true);
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={100} />
        <Header isSlide={false} title="" />
      </Slide>
      <RegisterLayout isNoPx isSlide={false}>
        <Slide isNoPadding>
          <Box px={5}>
            <RegisterOverview isShort>
              <span>썸네일 이미지를 선택해 주세요.</span>
            </RegisterOverview>
          </Box>
          <Box ml={5}>
            <ImageBasicSlider2
              selectedImageUrl={imageProps?.mainImage}
              imageTileArr={mainImageArr}
              hasTextSkeleton={false}
              aspect={1}
            />
          </Box>{" "}
          <Box px={5} mt={10}>
            <RegisterOverview isShort>
              <span>커버 이미지를 선택해 주세요.</span>
            </RegisterOverview>
          </Box>
          <Box pl={5}>
            <ImageBasicSlider2
              selectedImageUrl={imageProps?.coverImage}
              imageTileArr={coverImageArr}
              aspect={2}
              hasTextSkeleton={false}
            />
          </Box>
        </Slide>
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} text="완료" />
      {isConfirmModal && (
        <GatherWritingConfirmModal setIsModal={setIsConfirmModal} gatherData={gatherContent} />
      )}
    </>
  );
}

export default GatherWritingImagePage;
