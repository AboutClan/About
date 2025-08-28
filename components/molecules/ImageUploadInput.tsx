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
    if (!file) return;
    try {
      toast("info", "임시 점검중");
      const image = await processFile(file);
      setImageUrl(image.url);
      changeImage(image.blob);
    } catch (error) {
      toast("info", "임시 점검중!");
      console.error("Error processing image", error);
    }
  };

  return (
    <>
      {/* 시각적으로만 숨김. display:none 금지 */}
      <Input
        ref={fileInputRef}
        id="studyAttendImage"
        type="file"
        accept="image/*;capture=camera" // 안드 카메라 힌트
        capture="environment" // 후면 카메라 힌트
        name="image"
        multiple={false}
        inputMode="none"
        onChange={handleImageChange}
        onClick={(e) => {
          (e.currentTarget as HTMLInputElement).value = "";
        }} // 동일 파일 재선택 허용
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          clipPath: "inset(50%)",
          border: 0,
          whiteSpace: "nowrap",
        }}
      />

      <Flex mb={5} justify="center">
        {!imageUrl ? (
          // 라벨 클릭 → 네이티브 파일/카메라 피커 (프로그램 클릭 X)
          <Box
            as="label"
            htmlFor="studyAttendImage"
            cursor="pointer"
            userSelect="none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.preventDefault();
            }}
          >
            <ImageUploadIcon />
          </Box>
        ) : (
          <Box w="160px" h="160px" borderRadius="20px" position="relative" overflow="hidden">
            <Image
              src={imageUrl}
              alt="Image Preview"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </Box>
        )}
      </Flex>
    </>
  );
}
