import { Box } from "@chakra-ui/react";

import ImageTileSlider from "../../components/organisms/sliders/ImageTileSlider";
import { REVIEW_DATA } from "../../storage/Review";

const IMAGE_VISIBLE = 10;

export default function GatherReviewSlider() {
  const imageArr = [...REVIEW_DATA]
    .slice(-IMAGE_VISIBLE)
    .reverse()
    .map((item, idx) => ({
      imageUrl: item.images[0],
      text: item.title,
      url: `/review?scroll=${item.id}`,
      priority: idx < 4,
    }));

  return (
    <Box p="12px 16px">
      <ImageTileSlider imageTileArr={imageArr} size="sm" slidesPerView={4.5} />
    </Box>
  );
}
