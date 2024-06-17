import styled from "styled-components";

import { EVENT_BANNER_PASSION, EVENT_BANNER_PROMOTION } from "../../../assets/images/imageUrl";
import ImageSliderBanner, {
  ImageBannerProp,
} from "../../../components/organisms/imageSlider/imageSliderType/ImageSliderBanner";

function EventBanner() {
  const imageArr: ImageBannerProp[] = [
    {
      url: "/eventCalendar",
      imageUrl: "/main.png",
    },
    { url: "/statistics", imageUrl: EVENT_BANNER_PASSION },
    { url: "/promotion", imageUrl: EVENT_BANNER_PROMOTION },
  ];

  return (
    <Layout>
      <ImageSliderBanner imageArr={imageArr} />
    </Layout>
  );
}

const Layout = styled.div`
  height: 180px;
  display: flex;
  flex-direction: column;
  background-color: RGB(235, 236, 240);
`;

export default EventBanner;
