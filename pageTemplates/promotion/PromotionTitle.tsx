import { Flex } from "@chakra-ui/react";
import styled from "styled-components";

import EveryTimeLogo from "../../components/atoms/Icons/CustomIcons";

function PromotionTitle() {
  return (
    <Layout>
      <Flex justify="center">
        <EveryTimeLogo />
      </Flex>
      <Detail>
        <div>
          에브리타임에 홍보글을 작성해주시면 <b>2000원(200 pt)</b>와 추첨을 통해 !!매 주!!{" "}
          <b>BBQ 황금 올리브 치킨 세트</b>를 드립니다!
        </div>
        <div>[학교 당 3일에 1번만 참여 가능]</div>
      </Detail>
    </Layout>
  );
}

const Layout = styled.div`
  margin: 0 20px;
  margin-top: 32px;
  text-align: center;
`;

const Detail = styled.div`
  margin-top: var(--gap-5);
  font-weight: 600;
  font-size: 13px;
  color: var(--gray-700);
  > div:first-child {
    margin-bottom: var(--gap-2);
    > b {
      color: #c62917;
      font-weight: 800;
    }
  }
  > div:last-child {
    color: var(--gray-800);
  }
`;

export default PromotionTitle;
