import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { IImageTileData } from "../../components/molecules/layouts/ImageTileFlexLayout";
import ImageTileGridLayout from "../../components/molecules/layouts/ImageTitleGridLayout";
import { useFeedsQuery } from "../../hooks/feed/queries";

export default function HomeReviewSection() {
  const router = useRouter();

  const { data: feeds } = useFeedsQuery("gather", null, 0, true);

  const imageArr: IImageTileData[] = feeds
    ?.map((feed) => ({
      imageUrl: feed.images[0],
      func: () => router.push(`/gather?category=all&tab=lounge&scroll=${feed.typeId}`),
      text: feed.text,
    }))
    .slice(0, 4);

  return (
    <Box mb="20px">
      <SectionHeader title="About 소셜링" subTitle="Meeting">
        <ButtonWrapper size="xs" url="/gather?category=all">
          <ShortArrowIcon dir="right" />
        </ButtonWrapper>
      </SectionHeader>
      <Box mt={4}>{imageArr && <ImageTileGridLayout size="lg" imageDataArr={imageArr} />}</Box>
    </Box>
  );
}
