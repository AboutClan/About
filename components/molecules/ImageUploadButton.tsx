import { Button, Input } from "@chakra-ui/react";
import { captureException } from "@sentry/nextjs";
import { useRef } from "react";

import { useToast } from "../../hooks/custom/CustomToast";
import { DispatchType } from "../../types/hooks/reactTypes";
import { processFile } from "../../utils/imageUtils";

interface IImageUploadButton {
  setImageUrls: DispatchType<string[]>;
  setImageForms: DispatchType<Blob[]>;
}

export default function ImageUploadButton({ setImageUrls, setImageForms }: IImageUploadButton) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files as FileList);
    const newImageUrls: string[] = [];
    const newImageForms: Blob[] = [];

    if (files.length + newImageUrls.length > 5) {
      toast("warning", "이미지는 최대 5장까지 가능합니다.");
      return;
    }

    for (const file of files) {
      try {
        const { url, blob } = await processFile(file);
        newImageUrls.push(url);
        newImageForms.push(blob);
      } catch (error) {
        captureException(error);
        console.error("Error processing image", error);
      }
    }

    setImageUrls((prev) => [...prev, ...newImageUrls]);
    setImageForms((prev) => [...prev, ...newImageForms]);
  };

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
        px="8px"
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
