import { Button } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import NotCompletedModal from "../../../../modals/system/NotCompletedModal";

function ContentGather() {
  const [isModal, setIsModal] = useState(false);
  return (
    <>
      <Layout>
        <Button
          onClick={() => setIsModal(true)}
          bgColor="var(--gray-200)"
          size="lg"
          w="100%"
          leftIcon={<i className="fa-light fa-plus" />}
        >
          모임 만들기
        </Button>
        <Message>진행한 모임이 없습니다.</Message>
      </Layout>
      {isModal && <NotCompletedModal setIsModal={setIsModal} />}
    </>
  );
}

const Layout = styled.div`
  padding: var(--gap-4);
`;

const Message = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  font-size: 16px;

  color: var(--gray-700);
`;

export default ContentGather;
