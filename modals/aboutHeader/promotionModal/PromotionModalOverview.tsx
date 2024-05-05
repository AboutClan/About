import { Flex } from "@chakra-ui/react";
import styled from "styled-components";

import EveryTimeLogo from "../../../components/atoms/Icons/CustomIcons";

function PromotionModalOverview() {
  return (
    <Layout>
      <Flex justify="center">
        <EveryTimeLogo />
      </Flex>
      <Detail>
        에브리타임에 홍보글을 작성해주시면 <b>100 Point</b>와 추첨을 통해{" "}
        <b>BBQ 황금 올리브 치킨</b>를 드려요!
      </Detail>
    </Layout>
  );
}

const Layout = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const Detail = styled.div`
  flex: 1;
  margin-top: var(--gap-5);
  font-weight: 600;
  font-size: 14px;
  color: var(--gray-2);
  > b {
    color: #c62917;
    font-weight: 800;
  }
`;

export default PromotionModalOverview;
