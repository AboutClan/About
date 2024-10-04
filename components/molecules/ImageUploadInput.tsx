import { Box, Flex, Input } from "@chakra-ui/react";
import Image from "next/image";
import { useRef, useState } from "react";
import styled from "styled-components";

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
      <Flex mb={5} justify="center" onClick={handleBtnClick}>
        {!imageUrl ? (
          <>
            <Box onClick={handleBtnClick} position="relative" w="122px" h="122px">
              <ImageUploadIcon />
            </Box>
          </>
        ) : (
          <ImageContainer>
            <Image src={imageUrl} alt="Image Preview" width={140} height={140} />
          </ImageContainer>
        )}
      </Flex>
    </>
  );
}

const CameraText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-500);
  margin-top: var(--gap-3);
`;

const Container = styled.div`
  margin: var(--gap-1) 0;
  padding: 16px;
  padding-bottom: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1.5px dashed var(--gray-400);
  border-radius: var(--rounded-lg);
  background-color: var(--gray-100);
`;

const ImageContainer = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
`;
