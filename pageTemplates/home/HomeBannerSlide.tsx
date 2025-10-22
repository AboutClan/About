import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import { MAIN_BANNER_IMAGE } from "../../assets/images/BannerImages";
import ImageSliderBanner from "../../components/organisms/imageSlider/imageSliderType/ImageSliderBanner";
import { getTodayStr } from "../../utils/dateTimeUtils";
import { navigateExternalLink } from "../../utils/navigateUtils";

function HomeBannerSlide() {
  const router = useRouter();
  const imageArr = MAIN_BANNER_IMAGE.map((banner) => {
    const handleClick = (category: "main" | "groupAdmin" | "faq" | "friendInvite" | "study") => {
      if (category === "main") return;
      else if (category === "groupAdmin") {
        navigateExternalLink(
          "https://docs.google.com/forms/d/1ghBI8sizrq19T9kwEsM_kBBjdPDnrzFtlZnhxPeUobc",
        );
      } else if (category === "faq") {
        router.push(`https://study-about.club/faq`);
      } else if (category === "friendInvite") {
        navigateExternalLink("https://pf.kakao.com/_SaWXn/chat");
      } else if (category == "study") {
        router.push(`/studyPage?date=${getTodayStr()}&modal=point`);
      }
    };

    return {
      imageUrl: banner.image,
      func: () => handleClick(banner.category),
    };
  });

  return (
    <>
      <Flex aspectRatio="2.12/1" flexDir="column" mb={5} overflow="hidden">
        <ImageSliderBanner imageArr={imageArr} />
      </Flex>
    </>
  );
}

export default HomeBannerSlide;
