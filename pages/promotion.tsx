import styled from "styled-components";

import Header from "@/components/layouts/Header";
import Slide from "@/components/layouts/PageSlide";
import PromotionApply from "@/features/promotion/screens/PromotionApply";
import PromotionContent from "@/features/promotion/screens/PromotionContent";
import PromotionDetail from "@/features/promotion/screens/PromotionDetail";
import PromotionTitle from "@/features/promotion/screens/PromotionTitle";

function Promotion() {
  return (
    <>
      <Header title="홍보 페이지" url="/home" />
      <Slide isNoPadding>
        <Layout>
          <PromotionTitle />
          <PromotionDetail />
          <PromotionApply />
          <PromotionContent />
        </Layout>
      </Slide>
    </>
  );
}

const Layout = styled.div``;

export default Promotion;
