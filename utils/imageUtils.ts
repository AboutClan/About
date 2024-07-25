import { GATHER_RANDOM_IMAGE_ARR } from "../assets/images/randomImages";

export const getRandomImage = () => {
  const idx = Math.floor(Math.random() * GATHER_RANDOM_IMAGE_ARR.length);
  return GATHER_RANDOM_IMAGE_ARR[idx];
};

export const optimizeImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 400; // 최대 너비를 설정합니다.
        const maxHeight = 400; // 최대 높이를 설정합니다.
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.7, // 품질 설정 (0.0에서 1.0 사이)
        );
      };
      img.onerror = (error) => {
        reject(error);
      };
    };
  });
};
