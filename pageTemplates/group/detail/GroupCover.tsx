import { Box } from "@chakra-ui/react";
import Image from "next/image";

import { SQUARE_RANDOM_IMAGE } from "../../../assets/images/imageUrl";

interface IGroupCover {
  image: string;
}

function GroupCover({ image }: IGroupCover) {
  return (
    <Box aspectRatio={2 / 1} position="relative">
      <Image
        src={image || SQUARE_RANDOM_IMAGE[0]}
        fill={true}
        sizes="400px"
        alt="study"
        priority={true}
      />
    </Box>
  );
}

export default GroupCover;
