import { Box, Button } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

import HeartLikeIcon from "../components/atoms/Icons/HeartLikeIcon";
import ScreenOverlay from "../components/atoms/ScreenOverlay";
import { IModal } from "../types/components/modalTypes";

interface IImageZoommodal extends IModal {
  toUid: string;
  imageUrl: string;
}

export default function ImageZoomModal({ toUid, imageUrl, setIsModal }: IImageZoommodal) {
  const [isHeart, setIsHeart] = useState(true);

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
          {isHeart && (
            <Button
              position="absolute"
              variant="ghost"
              bottom="12px"
              right="4px"
              onClick={() => setIsHeart(false)}
            >
              <HeartLikeIcon toUid={toUid} size="lg" />
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}
