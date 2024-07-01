import { Flex } from "@chakra-ui/react";

import {
  CLUB_BANNER_IMAGE,
  GATHER_BANNER_IMAGE,
  MAIN_BANNER_IMAGE,
} from "../../../assets/images/BannerImages";
import ImageSliderBanner, {
  ImageBannerProp,
} from "../../../components/organisms/imageSlider/imageSliderType/ImageSliderBanner";
import { HomeTab } from "../HomeTab";

interface EventBannerProps {
  tab: HomeTab;
}

function EventBanner({ tab }: EventBannerProps) {
  const imageArr: ImageBannerProp[] = (
    tab === "스터디" || !tab
      ? MAIN_BANNER_IMAGE
      : tab === "모임"
        ? GATHER_BANNER_IMAGE
        : CLUB_BANNER_IMAGE
  ).map((banner) => ({
    url: banner?.url,
    imageUrl: banner.image,
  }));


  const isLightBanner = tab === "동아리";

  return (
    <>
      <Flex aspectRatio={!isLightBanner ? "2.1/1" : "4/1"} flexDir="column">
        <ImageSliderBanner imageArr={imageArr} isLightBanner={isLightBanner} />
      </Flex>
    </>
  );
}

export default EventBanner;
