import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import ImageBasicSlider, {
  ImageTileProps,
} from "../../components/organisms/sliders/ImageBasicSlider";
import { useFeedsQuery } from "../../hooks/feed/queries";

export default function GatherReviewSlider() {
  const router = useRouter();

  const { data: feeds } = useFeedsQuery("gather", null, 0, true);

  const imageArr: ImageTileProps[] = feeds?.map((feed) => ({
    imageUrl: feed.images[0],
    func: () => router.push(`/square?tab=lounge&category=gather&scroll=${feed.typeId}`),
    text: feed.title,
  }));

  return (
    <Box p="12px 16px" pr="0">
      <ImageBasicSlider
        imageTileArr={imageArr}
        size="sm"
        firstItem={{
          icon: <i className="fa-solid fa-image fa-3x" style={{ color: "var(--color-gray)" }} />,
          func: () => router.push("/square?tab=lounge&category=gather"),
          text: "번개 리뷰",
        }}
      />
    </Box>
  );
}
