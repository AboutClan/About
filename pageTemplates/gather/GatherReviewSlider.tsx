import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import ImageBasicSlider, {
  ImageTileProps,
} from "../../components/organisms/sliders/ImageBasicSlider";

import { IReviewData, REVIEW_DATA } from "../../storage/Review";

const IMAGE_VISIBLE = 10;

export default function GatherReviewSlider() {
  const router = useRouter();

  const imageArr: ImageTileProps[] = [
    ...REVIEW_DATA,
    {
      id: null,
      dateCreated: null,
      images: [
        "https://user-images.githubusercontent.com/84257439/242179172-dc4938a6-7902-4ea5-b3a9-1c44f15f1d77.jpg",
      ],
      title: "모임 리뷰",
    } as IReviewData,
  ]
    .slice(-IMAGE_VISIBLE)
    .reverse()
    .map((item) => ({
      imageUrl: item.images[0],
      func: () => router.push(`/review?scroll=${item.id}`),
      text: item.title,
    }));

  return (
    <Box p="12px 20px">
      <ImageBasicSlider imageTileArr={imageArr} size="sm" />
    </Box>
  );
}
