import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import styled from "styled-components";
import { BANNER_IMAGE } from "../../../assets/images/BannerImages";
import { Badge } from "../../../components/atoms/badges/Badges";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";

function BannerDetailPage() {
  const { category } = useParams<{ category }>() || {};

  const banner = BANNER_IMAGE.find((item) => item.category === category);
  console.log(banner);

  return (
    <>
      <Header title="" />
      <Slide>
        <Box w="100%" aspectRatio="2.1/1" pos="relative">
          {banner && <Image src={banner.image} fill={true} sizes="400px" alt="bannerImage" />}
        </Box>
        <Layout>
          <Title>
            <div>
              <span>같이 카공하고 상품 받자!</span>
              <Badge text="이벤트" colorScheme="mintTheme" size="lg" />
            </div>
          </Title>
        </Layout>
        <Box bgColor="pink" h="200px">
          준비중
        </Box>
      </Slide>
    </>
  );
}

const Layout = styled.div`
  padding: var(--gap-4);
  padding-bottom: var(--gap-2);
  background-color: white;
  border-bottom: var(--border);
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--gap-1);
  color: var(--gray-800);
  font-size: 18px;

  font-weight: 800;
  > div:first-child {
    > span {
      margin-right: var(--gap-2);
    }
  }
`;

const SubInfo = styled.div`
  height: 32px;
  font-size: 13px;
  display: flex;
  color: var(--gray-600);
`;

export default BannerDetailPage;
