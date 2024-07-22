import { useState } from "react";
import styled from "styled-components";

import ModalPortal from "../../modals/ModalPortal";
import NotCompletedModal from "../../modals/system/NotCompletedModal";

function ReviewStatus() {
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <Layout onClick={() => setIsModal(true)}>
        <Item>
          <i className="fa-regular fa-heart fa-xl" />
          <span>100</span>
        </Item>
        <Item>
          <i className="fa-regular fa-message fa-xl" />
          <span>10</span>
        </Item>
      </Layout>
      {isModal && (
        <ModalPortal setIsModal={setIsModal}>
          <NotCompletedModal setIsModal={setIsModal} />
        </ModalPortal>
      )}
    </>
  );
}

const Layout = styled.div`
  display: flex;

  padding: 16px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  margin-right: var(--gap-3);
  > span {
    margin-left: var(--gap-1);
    font-weight: 600;
    font-size: 15px;
  }
`;

export default ReviewStatus;
