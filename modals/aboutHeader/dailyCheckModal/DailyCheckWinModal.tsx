import { useRecoilState } from "recoil";
import styled from "styled-components";

import { transferDailyCheckWinState } from "../../../recoils/transferRecoils";
import { IFooterOptions, IHeaderOptions, ModalLayout } from "../../Modals";

function DailyCheckWinModal() {
  const [dailyCheckWin, setDailyCheckWin] = useRecoilState(transferDailyCheckWinState);

  const onClick = () => {
    setDailyCheckWin(null);
  };

  if (!dailyCheckWin) return;

  const headerOptions: IHeaderOptions = {
    subTitle: `헉...! ${dailyCheckWin.percent}% 확률을 뚫고 당첨되었어요!`,
  };

  const footerOptions: IFooterOptions = {
    main: {},
  };

  return (
    <ModalLayout
      title="랜덤 선물 당첨!"
      headerOptions={headerOptions}
      footerOptions={footerOptions}
      setIsModal={onClick}
      // size="md"
    >
      {/* <ModalHeader
        display="flex"
        p="var(--gap-3) var(--gap-4)"
        justifyContent="space-between"
      >
        <i className="fa- fa-lollipop" color="var(--color-mint)" />
        <span>랜덤 선물 당첨</span>
        <i className="fa- fa-lollipop" color="var(--color-mint)" />
      </ModalHeader> */}

      <GiftWrapper>
        <Gift>{dailyCheckWin.item}</Gift>
      </GiftWrapper>
      <SubMessage>
        {dailyCheckWin.item.includes("Point")
          ? "포인트가 적립되었습니다."
          : "상품은 확인후 카톡으로 보내드립니다."}
      </SubMessage>

      {/* <ModalFooterOne text="확인" onClick={onClick} /> */}
    </ModalLayout>
  );
}

const GiftWrapper = styled.div`
  margin: 8px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Gift = styled.div`
  border: var(--border-mint);
  width: 100%;
  padding: 16px 20px;
  border-radius: var(--rounded-lg);
  font-size: 18px;
  color: var(--color-mint);
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SubMessage = styled.span`
  font-size: 13px;
`;

export default DailyCheckWinModal;
