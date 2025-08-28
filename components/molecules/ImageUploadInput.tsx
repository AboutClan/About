import { Box, Flex, Input } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

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
    <Flex mb={5} justify="center">
      {!imageUrl ? (
        // ✅ 아이콘 위에 실제 <input type="file">를 전면 덮음 (label/프로그램 클릭 사용 안함)
        <Box
          position="relative"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          w="80px"
          h="80px"
          cursor="pointer"
          userSelect="none"
        >
          <ImageUploadIcon />
          <Input
            type="file"
            name="image"
            accept="image/*;capture=camera" // 안드: 카메라 힌트
            capture="environment" // iOS/일부 브라우저: 후면 카메라 힌트
            multiple={false}
            onChange={handleImageChange}
            onClick={(e) => {
              (e.currentTarget as HTMLInputElement).value = "";
            }} // 동일 파일 재선택 허용
            variant="unstyled"
            sx={{
              position: "absolute",
              inset: 0, // 아이콘 영역 전부 덮기
              opacity: 0, // 완전 투명
              width: "100%",
              height: "100%",
              zIndex: 1,
              cursor: "pointer",
              pointerEvents: "auto", // 반드시 클릭 가능
            }}
          />
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
  );
}
