import { Flex } from "@chakra-ui/react";

import {
  CLUB_BANNER_IMAGE,
  GATHER_BANNER_IMAGE,
  MAIN_BANNER_IMAGE,
} from "../../assets/images/BannerImages";
import ImageSliderBanner from "../../components/organisms/imageSlider/imageSliderType/ImageSliderBanner";

function HomeBannerSlide() {
  const imageArr = [...MAIN_BANNER_IMAGE, ...GATHER_BANNER_IMAGE, ...CLUB_BANNER_IMAGE].map(
    (banner) => ({
      url: banner?.url,
      imageUrl: banner.image,
    }),
  );

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
        <ImageSliderBanner imageArr={imageArr} />
      </Flex>
    </>
  );
}

export default HomeBannerSlide;
