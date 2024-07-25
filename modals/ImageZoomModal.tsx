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
        <Box position="relative" width="320px" maxHeight="400px">
          <Image src={imageUrl} width={320} height={400} alt="studyPrivateImage" priority={true} />
        </Box>
      </Box>
    </>
  );
}
