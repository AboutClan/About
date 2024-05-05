import { useRouter } from "next/router";
import styled from "styled-components";

import {
  EVENT_BANNER_CALENDAR,
  EVENT_BANNER_PASSION,
  EVENT_BANNER_PROMOTION,
} from "../../assets/images/imageUrl";
import ImageSlider from "../../components/organisms/imageSlider/ImageSlider";

function EventBanner() {
  const router = useRouter();

  const imageArr = [EVENT_BANNER_CALENDAR, EVENT_BANNER_PASSION, EVENT_BANNER_PROMOTION];

  return (
    <Layout onClick={() => router.push(`/eventCalendar`)}>
      <ImageSlider type="eventBanner" imageContainer={imageArr} />
    </Layout>
  );
}

// 16 더블

const Layout = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  flex-direction: column;
  background-color: RGB(235, 236, 240);
`;

export default EventBanner;
