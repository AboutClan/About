import styled from "styled-components";

import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import PromotionApply from "../pageTemplates/promotion/PromotionApply";
import PromotionContent from "../pageTemplates/promotion/PromotionContent";
import PromotionDetail from "../pageTemplates/promotion/PromotionDetail";
import PromotionTitle from "../pageTemplates/promotion/PromotionTitle";

function Promotion() {
  return (
    <>
      <Header title="홍보 페이지" />
      <Slide>
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
