import { Input } from "@chakra-ui/react";
import { captureException } from "@sentry/nextjs";
import Image from "next/image";
import { useRef, useState } from "react";
import styled from "styled-components";

import { DispatchType } from "../../types/hooks/reactTypes";
import { optimizeImage } from "../../utils/imageUtils";

interface IImageUploadInput {
  setImageUrl: DispatchType<Blob>;
}

export default function ImageUploadInput({ setImageUrl: changeImage }: IImageUploadInput) {
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = async (e) => {
    const file: File = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();

      // 이미 브라우저에서 읽을 수 있는 이미지 형식이거나, 확장자가 HEIC인 경우에만 변환 시도
      if (file.type !== "image/heic" && fileExtension !== "heic") {
        const optimizedImage = await optimizeImage(file);
        const image = URL.createObjectURL(optimizedImage);
        setImageUrl(image);
        changeImage(optimizedImage);
      } else {
        // 동적 임포트를 사용하여 heic2any를 클라이언트 사이드에서만 로드
        const heic2any = (await import("heic2any")).default;
        try {
          const convertedBlob = (await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          })) as Blob;

          const image = URL.createObjectURL(convertedBlob);
          setImageUrl(image);
          changeImage(convertedBlob);
        } catch (error) {
          // 이미 브라우저에서 읽을 수 있는 형식의 이미지인 경우 변환 과정 생략
          if (error.code === 1) {
            const image = URL.createObjectURL(file);
            setImageUrl(image);
            changeImage(file);
          } else {
            captureException(error);
            console.error("Error converting HEIC to JPEG", error);
          }
        }
      }
    }
  };

  const fileInputRef = useRef(null);

  const handleBtnClick = () => {
    fileInputRef.current.click();
  };

  // useEffect(() => {
  //   changeImage(imageUrl);
  // }, [imageUrl]);

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
      <Container onClick={handleBtnClick}>
        {!imageUrl ? (
          <>
            <i
              className="fa-light fa-camera-viewfinder fa-4x "
              style={{ color: "var(--gray-500)" }}
            />
            <CameraText>사진 올리기</CameraText>
          </>
        ) : (
          <ImageContainer>
            <Image src={imageUrl} alt="Image Preview" width={140} height={140} />
          </ImageContainer>
        )}
      </Container>
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
