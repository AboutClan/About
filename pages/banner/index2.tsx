import { Box } from "@chakra-ui/react";
import Image from "next/image";

import { BBB } from "../../assets/images/BannerImages";
import Header from "../../components/layouts/Header";

function BannerPage() {
  return (
    <>
      <Header title="동아리 이벤트" />
      {BBB.map((banner, idx) => (
        <Box w="100%" aspectRatio="1/1" key={idx} pos="relative" mb="12px">
          <Image src={banner.image} fill={true} sizes="400px" alt="bannerImage" />
        </Box>
      ))}
    </>
  );
}

export default BannerPage;
