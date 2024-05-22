import { Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import HighlightedTextButton from "../../components/atoms/buttons/HighlightedTextButton";

import SectionBar from "../../components/molecules/bars/SectionBar";
import ImageTileSlider, { IImageTile } from "../../components/organisms/sliders/ImageTileSlider";
import { STORE_GIFT } from "../../storage/Store";

export default function EventStore() {
  const router = useRouter();
  const imageArr: IImageTile[] = STORE_GIFT.map((gift) => ({
    imageUrl: gift.image,
    text: gift.name,
    url: "/store",
  }));

  return (
    <>
      <Flex justify="space-between" align="center" bgColor="white" borderBottom="var(--border)">
        <SectionBar
          title="포인트 스토어"
          size="md"
          rightComponent={
            <HighlightedTextButton text="더보기" onClick={() => router.push("/store")} />
          }
        />
      </Flex>
      <Box p="12px 16px" borderBottom="var(--border)">
        <ImageTileSlider imageTileArr={imageArr} size="sm" slidesPerView={3.4} />
      </Box>
    </>
  );
}
