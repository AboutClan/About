import { Button, Input } from "@chakra-ui/react";
import { captureException } from "@sentry/nextjs";
import { useRef } from "react";

import { DispatchType } from "../../types/hooks/reactTypes";
import { optimizeImage } from "../../utils/imageUtils";

interface IImageUploadButton {
  setImageUrls: DispatchType<string[]>;
  setImageForms: DispatchType<Blob[]>;
}

export default function ImageUploadButton({
  setImageUrls,
  setImageForms: changeImages,
}: IImageUploadButton) {
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files as FileList);
    const newImageUrls: string[] = [];
    const newImageForms: Blob[] = [];

    for (const file of files) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (file.type !== "image/heic" && fileExtension !== "heic") {
        const optimizedImage = await optimizeImage(file);
        const image = URL.createObjectURL(optimizedImage);
        newImageUrls.push(image);
        newImageForms.push(optimizedImage);
      } else {
        const heic2any = (await import("heic2any")).default;
        try {
          const convertedBlob = (await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          })) as Blob;

          const image = URL.createObjectURL(convertedBlob);
          newImageUrls.push(image);
          newImageForms.push(convertedBlob);
        } catch (error: any) {
          if (error.code === 1) {
            const image = URL.createObjectURL(file);
            newImageUrls.push(image);
            newImageForms.push(file);
          } else {
            captureException(error);
            console.error("Error converting HEIC to JPEG", error);
          }
        }
      }
    }

    setImageUrls((prev) => [...prev, ...newImageUrls]);
    changeImages((prev) => [...prev, ...newImageForms]);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBtnClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Input
        display="none"
        ref={fileInputRef}
        id="studyAttendImage"
        type="file"
        accept="image/*"
        multiple
        name="image"
        onChange={handleImageChange}
      />
      <Button
        color="var(--gray-600)"
        type="button"
        leftIcon={<i className="fa-regular fa-image fa-lg" />}
        variant="ghost"
        size="sm"
        onClick={handleBtnClick}
      >
        사진
      </Button>
    </>
  );
}
