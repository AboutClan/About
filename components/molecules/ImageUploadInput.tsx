import { Box, Flex, Input } from "@chakra-ui/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useToast } from "../../hooks/custom/CustomToast";

import { DispatchType } from "../../types/hooks/reactTypes";
import { processFile } from "../../utils/imageUtils";
import ImageUploadIcon from "../Icons/ImageUploadIcon";

interface IImageUploadInput {
  setImageUrl: DispatchType<Blob>;
}

export default function ImageUploadInput({ setImageUrl: changeImage }: IImageUploadInput) {
  const toast = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        toast("info", "임시 점검중");
        const image = await processFile(file);
        setImageUrl(image.url);
        changeImage(image.blob);
      } catch (error) {
        toast("info", "임시 점검중!");
        console.error("Error processing image", error);
      }
    }
  };

  const handleBtnClick = () => {
    const el = fileInputRef.current;
    if (!el) return;
    el.value = ""; // 동일 파일 재선택 허용

    // ✅ TS 안전 가드
    if ("showPicker" in el && typeof el.showPicker === "function") {
      el.showPicker();
    } else {
      el.click();
    }
  };

  return (
    <>
      <Input
        sx={{ position: "absolute", opacity: 0, width: "1px", height: "1px" }}
        ref={fileInputRef}
        id="studyAttendImage"
        type="file"
        accept="image/*;capture=camera" // 안드로이드 카메라 우선 힌트
        capture="environment" // 후면 카메라 힌트
        name="image"
        multiple={false} // 단일 파일만
        inputMode="none" // 모바일 키보드 노출 방지 힌트
        aria-hidden="true" // 보조공학 노출 최소화
        onChange={handleImageChange}
      />
      <Flex mb={5} justify="center">
        {!imageUrl ? (
          <>
            <Box onClick={handleBtnClick}>
              <ImageUploadIcon />
            </Box>
          </>
        ) : (
          <Box w="160px" h="160px" borderRadius="20px" position="relative" overflow="hidden">
            <Image
              src={imageUrl}
              alt="Image Preview"
              fill
              style={{
                objectFit: "cover", // 여기에 스타일로 objectFit 적용
                objectPosition: "center", // 중앙 정렬
              }}
            />
          </Box>
        )}
      </Flex>
    </>
  );
}
