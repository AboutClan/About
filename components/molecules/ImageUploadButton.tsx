import { Button, Input } from "@chakra-ui/react";
import { useRef } from "react";

import { useToast } from "../../hooks/custom/CustomToast";
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
  const toast = useToast();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files as FileList);

    if (maxFiles && files.length > maxFiles) {
      toast("warning", `이미지는 ${maxFiles}개까지 추가할 수 있어요.`);
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
        border="none"
      >
        사진
      </Button>
    </>
  );
}
