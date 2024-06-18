import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { BANNER_IMAGE } from "../../assets/images/BannerImages";
import Header from "../../components/layouts/Header";

function BannerPage() {
  return (
    <>
      <Header title="" />
      {BANNER_IMAGE.map((banner) => (
        <Box w="100%" aspectRatio="2.1/1" pos="relative" mb="12px">
          <Image src={banner.image} fill={true} sizes="400px" alt="bannerImage" />
        </Box>
      ))}
    </>
  );
}

export default BannerPage;
