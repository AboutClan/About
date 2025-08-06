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
        px="6px"
        color="var(--gray-500)"
        type="button"
        iconSpacing="4px"
        leftIcon={<PhotoIcon />}
        variant="ghost"
        size="sm"
        onClick={handleBtnClick}
        fontSize="12px"
        border="none"
      >
        사진
      </Button>
    </>
  );
}

function PhotoIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="var(--gray-500)"
  >
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm80-160h400q12 0 18-11t-2-21L586-459q-6-8-16-8t-16 8L450-320l-74-99q-6-8-16-8t-16 8l-80 107q-8 10-2 21t18 11Z" />
  </svg>
}
