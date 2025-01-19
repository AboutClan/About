import { Box } from "@chakra-ui/react";
import Image from "next/image";

import { AAA } from "../../assets/images/BannerImages";
import Header from "../../components/layouts/Header";

function BannerPage() {
  return (
    <>
      <Header title="동아리 공지사항" />
      {AAA.map((banner, idx) => (
        <Box w="100%" aspectRatio="4/5" key={idx} pos="relative" mb="12px">
          <Image src={banner.image} fill={true} sizes="400px" alt="bannerImage" />
        </Box>
      ))}
    </>
  );
}

export default BannerPage;
