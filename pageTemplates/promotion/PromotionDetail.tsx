import { Button } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import { usePromotionQuery } from "../../hooks/sub/promotion/queries";
import PromotionAllCoolTimeModal from "../../modals/promotion/PromotionAllCoolTimeModal";
import PromotionMyCoolTimeModal from "../../modals/promotion/PromotionMyCoolTimeModal";

function PromotionDetail() {
  const [isMyModal, setIsMyModal] = useState(false);
  const [isAllModal, setIsAllModal] = useState(false);

  const { data: promotionData } = usePromotionQuery();

  const onClick = () => {
    setIsMyModal(true);
  };

  return (
    <>
      <Layout>
        <Button
          w="50%"
          mr="var(--gap-2)"
          onClick={() => setIsAllModal(true)}
          color="var(--gray-700)"
          borderRadius="var(--rounded-lg)"
          border="1px solid var(--gray-300)"
        >
          전체 현황
        </Button>
        <Button
          w="50%"
          onClick={onClick}
          borderRadius="var(--rounded-lg)"
          color="var(--gray-700)"
          border="1px solid var(--gray-300)"
        >
          지난 당첨 기록
        </Button>
      </Layout>
      {isMyModal && <PromotionMyCoolTimeModal setIsModal={setIsMyModal} />}
      {isAllModal && (
        <PromotionAllCoolTimeModal setIsModal={setIsAllModal} promotionData={promotionData} />
      )}
    </>
  );
}

const Layout = styled.div`
  display: flex;
  margin: 0 40px;
  margin-top: 32px;
  margin-bottom: var(--gap-4);
`;

export default PromotionDetail;
