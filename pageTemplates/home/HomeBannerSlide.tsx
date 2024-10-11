import { Flex } from "@chakra-ui/react";

import {
  CLUB_BANNER_IMAGE,
  GATHER_BANNER_IMAGE,
  MAIN_BANNER_IMAGE,
} from "../../assets/images/BannerImages";
import ImageSliderBanner, {
  ImageBannerProp,
} from "../../components/organisms/imageSlider/imageSliderType/ImageSliderBanner";
import { HomeTab } from "./HomeTab";

interface EventBannerProps {
  tab: HomeTab;
}

function HomeBannerSlide({ tab }: EventBannerProps) {
  const imageArr: ImageBannerProp[] = (
    tab === "추천" || !tab
      ? MAIN_BANNER_IMAGE
      : tab === "번개"
        ? GATHER_BANNER_IMAGE
        : CLUB_BANNER_IMAGE
  ).map((banner) => ({
    url: banner?.url,
    imageUrl: banner.image,
  }));

  const isLightBanner = tab === "캘린더";

  return (
    <>
      <Flex
        aspectRatio={"2.127/1"}
        flexDir="column"
        mt={3}
        mb={5}
        borderRadius="16px"
        overflow="hidden"
      >
        <ImageSliderBanner imageArr={imageArr} isLightBanner={isLightBanner} />
      </Flex>
    </>
  );
}

export default HomeBannerSlide;
