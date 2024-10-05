import { Box, Flex, Input } from "@chakra-ui/react";
import Image from "next/image";
import { useRef, useState } from "react";

import { DispatchType } from "../../types/hooks/reactTypes";
import { processFile } from "../../utils/imageUtils";
import ImageUploadIcon from "../atoms/Icons/ImageUploadIcon";

interface IImageUploadInput {
  setImageUrl: DispatchType<Blob>;
}

export default function ImageUploadInput({ setImageUrl: changeImage }: IImageUploadInput) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const image = await processFile(file);
        setImageUrl(image.url);
        changeImage(image.blob);
      } catch (error) {
        console.error("Error processing image", error);
      }
    }
  };

  const handleBtnClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Input
        display="none"
        ref={fileInputRef}
        id="studyAttendImage"
        type="file"
        accept="image/*"
        name="image"
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
              layout="fill"
              objectFit="cover" // 이미지를 자를 때 비율을 유지하며 박스에 맞춤
              objectPosition="center" // 이미지를 중앙에서 자르도록 설정
            />
          </Box>
        )}
      </Flex>
    </>
  );
}
