import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import HighlightedTextButton from "../../components/atoms/buttons/HighlightedTextButton";
import SectionBar from "../../components/molecules/bars/SectionBar";
import { IImageTileData } from "../../components/molecules/layouts/ImageTileFlexLayout";
import ImageTileGridLayout from "../../components/molecules/layouts/ImageTitleGridLayout";
import { useFeedsQuery } from "../../hooks/feed/queries";

export default function HomeReviewSection() {
  const router = useRouter();

  const { data: feeds } = useFeedsQuery("gather", null, 0, true);

  const imageArr: IImageTileData[] = feeds
    ?.map((feed) => ({
      imageUrl: feed.images[0],
      func: () => router.push(`/square?tab=lounge&category=gather&scroll=${feed.typeId}`),
      text: feed.text,
    }))
    .slice(0, 4);

  return (
    <Box mb="24px">
      <SectionBar
        title="ABOUT 모임 후기"
        rightComponent={<HighlightedTextButton text="더보기" url="/review" />}
      />
      <Box p="16px">{imageArr && <ImageTileGridLayout imageDataArr={imageArr} />}</Box>
    </Box>
  );
}
