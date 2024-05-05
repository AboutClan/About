import { Box } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";

import SectionBar from "../../components/molecules/bars/SectionBar";
import ImageTileGridLayout, {
  IImageTileData,
} from "../../components/molecules/layouts/ImageTitleGridLayout";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import { REVIEW_DATA } from "../../storage/Review";

export default function HomeReviewSection() {
  const setSlideDirection = useSetRecoilState(slideDirectionState);

  const imageData: IImageTileData[] = REVIEW_DATA.slice(-4)
    .reverse()
    .map((review) => ({
      imageUrl: review.images[0],
      text: review.text,
      url: `/review?scroll=${review.id}`,
      func: () => setSlideDirection("right"),
    }));

  return (
    <>
      <SectionBar title="ABOUT 모임 후기" />
      <Box p="16px">
        <ImageTileGridLayout imageDataArr={imageData} />
      </Box>
    </>
  );
}
