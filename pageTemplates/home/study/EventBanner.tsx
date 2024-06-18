import styled from "styled-components";

import { MAIN_BANNER_IMAGE } from "../../../assets/images/BannerImages";
import Slide from "../../../components/layouts/PageSlide";
import ImageSliderBanner, {
  ImageBannerProp,
} from "../../../components/organisms/imageSlider/imageSliderType/ImageSliderBanner";

interface EventBannerProps {
  tab: "스터디" | "모임";
}

function EventBanner({ tab }: EventBannerProps) {
  console.log(tab);
  const imageArr: ImageBannerProp[] = MAIN_BANNER_IMAGE.map((banner) => ({
    url: `/banner/${banner.category}`,
    imageUrl: banner.image,
  }));

  return (
    <Slide>
      <Layout>
        <ImageSliderBanner imageArr={imageArr} />
      </Layout>
    </Slide>
  );
}

const Layout = styled.div`
  aspect-ratio: 2.1 / 1;
  display: flex;
  flex-direction: column;
  background-color: RGB(235, 236, 240);
`;

export default EventBanner;
