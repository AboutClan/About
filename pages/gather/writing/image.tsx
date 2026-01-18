import { Box, } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useRecoilState } from "recoil";

import { GATHER_COVER_IMAGE_ARR, GATHER_MAIN_IMAGE_ARR } from "../../../assets/gather";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import ImageBasicSlider2 from "../../../components/organisms/sliders/ImageBasicSlider2";
import { GatherCategoryMain } from "../../../constants/contentsText/GatherContents";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useErrorToast, useToast } from "../../../hooks/custom/CustomToast";
import { useGatherWritingMutation } from "../../../hooks/gather/mutations";
import GatherWritingConfirmModal from "../../../modals/gather/GatherWritingConfirmModal";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";
import {
  GatherCategory,
  IGather,
  IGatherWriting,
} from "../../../types/models/gatherTypes/gatherTypes";

interface ImageProps {
  imageUrl: string;
  func: () => void;
}

function GatherWritingImagePage() {
  const router = useRouter();
  const toast = useToast();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
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
  const [image, setImage] = useState<Blob>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const groupId = searchParams.get("groupId");
  const category: GatherCategoryMain = gatherContent?.type.title || "힐링";

  const isEdit = searchParams.get("edit");

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
      if (fileInputRef.current||image) {
        fileInputRef.current.value = null;
        setImage(null);
      }
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
    setImageArr({
      main: (groupId && gatherContent?.image
        ? [
            {
              imageUrl: gatherContent.image,
              func: () => setImageProps((old) => ({ ...old, mainImage: gatherContent.image })),
            },
          ]
        : []
      ).concat(
        shuffleArray(mainImageArr.filter((image) => image.imageUrl !== gatherContent?.image)),
      ),
      cover: (groupId && gatherContent?.coverImage
        ? [
            {
              imageUrl: gatherContent.coverImage,
              func: () =>
                setImageProps((old) => ({ ...old, coverImage: gatherContent.coverImage })),
            },
          ]
        : []
      ).concat(
        shuffleArray(coverImageArr.filter((image) => image.imageUrl !== gatherContent?.coverImage)),
      ),
    });
  }, []);

  const onClickNext = async () => {
    if ((!imageProps?.mainImage&&!image) || !imageProps?.coverImage) {
      toast("error", "이미지를 선택해 주세요.");
      return;
    }
    const gatherData: Partial<IGatherWriting> = {
      ...gatherContent,
      image: imageProps.mainImage,
      coverImage: imageProps.coverImage,
      // category: { category: (groupId ? "group" : "gather") as GatherCategory, id: groupId },
    };

    setGatherContent(gatherData);
    setIsConfirmModal(true);
  };

  const { mutate: createGather, isLoading: isLoading1 } = useGatherWritingMutation("post", {
    onSuccess(data) {
      queryClient.refetchQueries({ queryKey: [GATHER_CONTENT], exact: false });
      setGatherContent(null);
      router.push(`/gather/${(data as unknown as { gatherId: number })?.gatherId}`);
      toast("success", "모임이 등록되었어요!");
      setIsConfirmModal(false);
    },
    onError: errorToast,
  });
  const { mutate: updateGather, isLoading: isLoading2 } = useGatherWritingMutation("patch", {
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [GATHER_CONTENT], exact: false });
      setGatherContent(null);
      router.push(`/gather/${(gatherContent as IGather).id}`);
      toast("success", "내용이 변경되었어요!");
      setIsConfirmModal(false);
    },
    onError: errorToast,
  });

  // const handleCameraBtn = () => {
  //   fileInputRef.current?.click();
  // };
  // const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     const image = await processFile(file); // ✅ 기존 유틸 그대로 사용
  //   setImage(image.blob);
  //   } catch (error) {
  //     console.error("이미지 처리 실패", error);
  //   }
  // };

  const handleSubmit=( data: {
    gather: IGatherWriting;
})=>{
  createGather(data)
    // const formData = new FormData();
    // formData.append("gather",JSON.stringify(data.gather))
    // formData.append('image',image)
    // createGather(formData)
  }
          
  
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
            {/* <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              display="none"
              onChange={handleImageChange}
            />
            <Button
              mt={5}
              mr={5}
              border="var(--border-main)"
              colorScheme={fileInputRef?.current?.value ? "black" : "gray"}
              leftIcon={<CameraIcon color={fileInputRef?.current?.value ? "white" : "black"} />}
              onClick={handleCameraBtn}
            >
              {fileInputRef?.current?.value ? "이미지 등록 완료" : "이미지 직접 등록"}
            </Button> */}
          </Box>{" "}
          <Box px={5} mt={5}>
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
      <BottomNav onClick={() => onClickNext()} text="완료" isLoading={isLoading1 || isLoading2} />
      {isConfirmModal && (
        <GatherWritingConfirmModal
          createGather={(data) => { handleSubmit(data)} }
          updateGather={(data) => updateGather(data)}
          setIsModal={setIsConfirmModal}
          gatherData={{
            ...gatherContent,
            ...(groupId ? { category: "group" as GatherCategory, groupId } : {}),
          }}
          isEdit={!!isEdit}
        />
      )}
    </>
  );
}

export default GatherWritingImagePage;

// const CameraIcon=({ color }: { color: "black" | "white" })=> {
//   return <svg
//     xmlns="http://www.w3.org/2000/svg"
//     height="18px"
//     viewBox="0 -960 960 960"
//     width="18px"
//     fill={color === "black" ? "var(--gray-800)" : "white"}
//   >
//     <path d="M480-260q75 0 127.5-52.5T660-440q0-75-52.5-127.5T480-620q-75 0-127.5 52.5T300-440q0 75 52.5 127.5T480-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l50-54q11-12 26.5-19t32.5-7h170q17 0 32.5 7t26.5 19l50 54h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Z" />
//   </svg>
// }
