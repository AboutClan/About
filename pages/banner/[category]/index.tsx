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
              <Badge text="이벤트" colorScheme="mint" size="lg" />
            </div>
          </Title>
        </Layout>
        {category === "study" && (
          <Box h="200px" p="16px" fontSize="14px">
            원하는 날짜와 시간, 장소에 언제든 카공 참여가 가능해요! 카공에서는 새로운 사람도 만나고
            개인 공부도 진행할 수 있습니다!
            <br />
            <br /> 원하는 장소가 없다면? 새로운 장소를 등록하고 개인이 등록할 수 있어요! 정규 장소로
            확정되면 추가 혜택을 받을 수 있습니다. <br />
            <br /> 투표만 해도 포인트를 획득하고, 일찍 투표할수록, 여러 장소를 투표할 수록 더 많이
            받을 수 있습니다. 미리미리 투표하고 포인트 받아가세요!
            <br />
            <br />
            오후 11시에 결과가 발표되고, 3명 이상 있어야 오픈돼요. 하지만 오픈되지 않았더라도
            걱정하지 마세요! 오픈하지 않은 경우 &quot;자유 오픈&quot; 또는 &quot;개인 스터디&quot;로
            자동으로 전환할 수 있습니다. 출석을 완료하면 동아리 점수와 일정 확률로 알파벳도 수집할
            수 있어요.
            <br />
            <br />
            같이 공부를 한 인원이 있었다면 이후에 리뷰를 보낼 수 있는 팝업이 날아와요! 이 곳에서
            같이 공부했던 인원과 친구 추가를 하거나, 좋아요를 보낼 수 있답니다!
          </Box>
        )}
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

export default BannerDetailPage;
