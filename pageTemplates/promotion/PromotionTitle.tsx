import { Flex } from "@chakra-ui/react";
import styled from "styled-components";

import EveryTimeLogo from "../../components/Icons/CustomIcons";

function PromotionTitle() {
  return (
    <Layout>
      <Flex justify="center">
        <EveryTimeLogo />
      </Flex>
      <Detail>
        <div>
          <b>(한정 이벤트)</b> 에브리타임 동아리 게시판에 홍보 글을 올려주시면 매주 두분께{" "}
          <b>올리브영 10,000원 기프티콘</b>을 드려요!
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
