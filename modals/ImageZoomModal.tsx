import { Box } from "@chakra-ui/react";
import Image from "next/image";

import ScreenOverlay from "../components/atoms/ScreenOverlay";
import { IModal } from "../types/components/modalTypes";

interface IImageZoommodal extends IModal {
  imageUrl: string;
}

export default function ImageZoomModal({ imageUrl, setIsModal }: IImageZoommodal) {
  return (
    <>
      <ScreenOverlay onClick={() => setIsModal(null)} zIndex={190} />
      <Box
        position="fixed"
        transform="translate(-50%,-50%)"
        top="50%"
        left="50%"
        zIndex={200}
        width="320px"
        height="400px"
        rounded="lg"
        overflow="hidden"
        onClick={() => setIsModal(null)}
      >
        <Box position="relative" width="320px" height="100%" maxHeight="400px">
          <Image
            src={imageUrl}
            fill
            alt="studyPrivateImage"
            priority={true}
            sizes="400px"
            style={{ objectPosition: "center", objectFit: "cover" }}
          />
        </Box>
      </Box>
    </>
  );
}
