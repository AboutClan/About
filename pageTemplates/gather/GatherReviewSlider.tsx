import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import ImageBasicSlider, {
  ImageTileProps,
} from "../../components/organisms/sliders/ImageBasicSlider";
import { REVIEW_DATA } from "../../storage/Review";

const IMAGE_VISIBLE = 10;

export default function GatherReviewSlider() {
  const router = useRouter();

  const imageArr: ImageTileProps[] = [...REVIEW_DATA]
    .slice(-IMAGE_VISIBLE)
    .reverse()
    .map((item) => ({
      imageUrl: item.images[0],
      func: () => router.push(`/review?scroll=${item.id}`),
      text: item.title,
    }));

  return (
    <Box p="12px 16px" pr="0">
      <ImageBasicSlider
        imageTileArr={imageArr}
        size="sm"
        firstItem={{
          icon: <i className="fa-solid fa-image fa-3x" style={{ color: "var(--color-gray)" }} />,
          func: () => router.push("/review"),
          text: "모임 리뷰",
        }}
      />
    </Box>
  );
}
