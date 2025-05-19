import { Box } from "@chakra-ui/react";
import Image from "next/image";

import { GATHER_COVER_IMAGE_ARR } from "../../../assets/gather";
import { getRandomImage } from "../../../utils/imageUtils";

interface IGroupCover {
  image: string;
}

function GroupCover({ image }: IGroupCover) {
  return (
    <Box aspectRatio={2 / 1} position="relative">
      <Image
        src={image || getRandomImage(GATHER_COVER_IMAGE_ARR["공통"])}
        fill={true}
        sizes="400px"
        alt="study"
        priority={true}
      />
    </Box>
  );
}

export default GroupCover;
