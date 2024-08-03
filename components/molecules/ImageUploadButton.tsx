import { Button, Input } from "@chakra-ui/react";
import { captureException } from "@sentry/nextjs";
import { useRef } from "react";

import { useFailToast } from "../../hooks/custom/CustomToast";
import { DispatchType } from "../../types/hooks/reactTypes";
import { processFile } from "../../utils/imageUtils";

interface IImageUploadButton {
  setImageUrls: DispatchType<string[]>;
  setImageForms: DispatchType<Blob[]>;
  maxFiles?: number;
}

export default function ImageUploadButton({
  setImageUrls,
  setImageForms,
  maxFiles,
}: IImageUploadButton) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useFailToast();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files as FileList);

    if (maxFiles && files.length > maxFiles) {
      toast("free", "이미지는 5개 이하로 추가할 수 있어요.");
      return;
    }

    const newImageUrls: string[] = [];
    const newImageForms: Blob[] = [];

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
