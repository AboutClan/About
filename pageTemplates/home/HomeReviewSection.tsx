import { Box, Grid, GridItem, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import ButtonWrapper from "../../components/atoms/ButtonWrapper";
import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import { IImageTileData } from "../../components/molecules/layouts/ImageTileFlexLayout";
import ImageTileGridLayout from "../../components/molecules/layouts/ImageTitleGridLayout";
import { useFeedsQuery } from "../../hooks/feed/queries";
import { FeedProps } from "../../types/models/feed";

export default function HomeReviewSection() {
  const router = useRouter();

  const { data: feeds } = useFeedsQuery("gather", null, 0, true);

  const imageArr: IImageTileData[] = (feeds as FeedProps[])
    ?.map((feed) => ({
      imageUrl: feed.images[0],
      func: () => router.push(`/gather?category=all&tab=lounge&scroll=${feed.typeId}`),
      text: feed.text,
      priority: false,
    }))
    .slice(0, 4);

  return (
    <Box mt={5} mb={3}>
      <SectionHeader title="About 모임 후기" subTitle="실제 참여자가 말해주는 이야기">
        <ButtonWrapper size="sm" url="/gather?category=all&tab=lounge">
          <ShortArrowIcon dir="right" />
        </ButtonWrapper>
      </SectionHeader>
      <Box mt={4}>
        {imageArr ? (
          <ImageTileGridLayout size="lg" imageDataArr={imageArr} />
        ) : (
          <Grid
            templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
            gap={3} // 각 셀 간의 간격
          >
            {[1, 2, 3, 4].map((item) => (
              <GridItem key={item} w="full">
                <Skeleton w="full" aspectRatio={1 / 1} borderRadius="12px"></Skeleton>
                <Skeleton mt={2} h="16.5px" w="full">
                  34
                </Skeleton>
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
