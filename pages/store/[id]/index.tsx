import "dayjs/locale/ko";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import StoreApplyGiftModal from "../../../modals/store/StoreApplyGiftModal";
import StoreGiftWinModal from "../../../modals/store/StoreGiftWinModal";
import StoreDetailCover from "../../../pageTemplates/store/detail/StoreDetailCover";
import StoreDetailDetails from "../../../pageTemplates/store/detail/StoreDetailDetails";
import StoreDetailNav from "../../../pageTemplates/store/detail/StoreDetailNav";
import StoreDetailOverview from "../../../pageTemplates/store/detail/StoreDetailOverview";
import { transferStoreGiftDataState } from "../../../recoils/transferRecoils";

dayjs.extend(localizedFormat);
dayjs.locale("ko");

function StoreItem() {
  const [isApplyModal, setIsApplyModal] = useState(false);
  const [isWinModal, setIsWinModal] = useState(false);

  const storeGiftData = useRecoilValue(transferStoreGiftDataState);
  const giftInfo = storeGiftData?.data;
  const isActive = storeGiftData?.isActive;

  return (
    <>
      <Header title="상세 정보" />
      <Slide>
        {storeGiftData && (
          <Layout>
            <StoreDetailCover image={giftInfo.image} isCompleted={!isActive} />
            <StoreDetailOverview
              info={giftInfo}
              totalApplyCnt={giftInfo.totalCnt}
              isActive={isActive}
            />
            <StoreDetailNav
              applyUsers={giftInfo.users}
              isCompleted={!isActive}
              setIsApplyModal={setIsApplyModal}
              setIsWinModal={setIsWinModal}
            />
            <StoreDetailDetails winnerCnt={giftInfo.winner} max={giftInfo.max} />
          </Layout>
        )}
      </Slide>
      {isApplyModal && <StoreApplyGiftModal setIsModal={setIsApplyModal} giftInfo={giftInfo} />}
      {isWinModal && (
        <StoreGiftWinModal
          setIsModal={setIsWinModal}
          applicants={giftInfo}
          winCnt={giftInfo.winner}
        />
      )}
    </>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 var(--gap-4);
`;

export default StoreItem;
