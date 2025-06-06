import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import { GATHER_COVER_IMAGE_ARR, GATHER_MAIN_IMAGE_ARR } from "../../../assets/gather";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import ImageBasicSlider2 from "../../../components/organisms/sliders/ImageBasicSlider2";
import { GatherCategoryMain } from "../../../constants/contentsText/GatherContents";
import GatherWritingConfirmModal from "../../../modals/gather/GatherWritingConfirmModal";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import { IGatherWriting } from "../../../types/models/gatherTypes/gatherTypes";

interface ImageProps {
  imageUrl: string;
  func: () => void;
}

function GatherWritingImagePage() {
  const [gatherContent, setGatherContent] = useRecoilState(sharedGatherWritingState);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [imageProps, setImageProps] = useState<{ mainImage: string; coverImage: string }>({
    mainImage: gatherContent?.image,
    coverImage: gatherContent?.coverImage,
  });
  const [imageArr, setImageArr] = useState<{ main: ImageProps[]; cover: ImageProps[] }>({
    main: [],
    cover: [],
  });

  const category: GatherCategoryMain = gatherContent?.type.title || "운동";

  function shuffleArray(array: ImageProps[]) {
    const result = [...array]; // 원본 배열을 복사
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // 0 이상 i 이하의 랜덤 인덱스
      [result[i], result[j]] = [result[j], result[i]]; // 요소 교환
    }
    return result;
  }

  const mainImageArr = [
    ...(category ? GATHER_MAIN_IMAGE_ARR[category] : []),
    ...GATHER_MAIN_IMAGE_ARR["공통"],
  ].map((item) => ({
    imageUrl: item,
    func: () => {
      setImageProps((old) => ({ ...old, mainImage: item }));
    },
  }));
  const coverImageArr = [
    ...(category ? GATHER_COVER_IMAGE_ARR[category] : []),
    ...GATHER_COVER_IMAGE_ARR["공통"],
  ].map((item) => ({
    imageUrl: item,
    func: () => {
      setImageProps((old) => ({ ...old, coverImage: item }));
    },
  }));

  useEffect(() => {
    setImageArr({ main: shuffleArray(mainImageArr), cover: shuffleArray(coverImageArr) });
  }, []);

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
              imageTileArr={imageArr.main}
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
              imageTileArr={imageArr.cover}
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
