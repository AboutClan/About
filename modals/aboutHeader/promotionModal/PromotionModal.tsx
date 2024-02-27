import { faCoins, faGift } from "@fortawesome/pro-duotone-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  IFooterOptions,
  IHeaderOptions,
  ModalLayout,
} from "../../../components/modals/Modals";
import { IModal } from "../../../types/reactTypes";
import PromotionModalOverview from "./PromotionModalOverview";

function PromotionModal({ setIsModal }: IModal) {
  const router = useRouter();
  const onClickAttend = () => {
    router.push(`/promotion`);
    setIsModal(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "참여 할래!",
      func: onClickAttend,
    },
    sub: {
      text: "다음에",
    },
  };

  const headerOptions: IHeaderOptions = {};

  return (
    <ModalLayout
      headerOptions={headerOptions}
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
      <PromotionModalOverview />
      <ImageContainer>
        <IconWrapper>
          <div>
            <FontAwesomeIcon
              icon={faGift}
              size="6x"
              color="var(--color-red)"
              style={
                {
                  "--fa-primary-opacity": "1",
                  "--fa-secondary-opacity": "0.4",
                } as React.CSSProperties
              }
            />
          </div>
          <div>
            <FontAwesomeIcon
              icon={faCoins}
              size="3x"
              color="var(--color-red)"
            />
          </div>
        </IconWrapper>
        <Info>
          <span>+ 100 POINT</span>
          <span>+ 추첨 선물</span>
        </Info>
      </ImageContainer>
    </ModalLayout>
  );
}

const ImageContainer = styled.div`
  margin-top: var(--gap-3);
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  > div:last-child {
    margin-left: var(--gap-1);
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-weight: 600;
  font-size: 12px;
  margin-left: 8px;
`;

export default PromotionModal;
