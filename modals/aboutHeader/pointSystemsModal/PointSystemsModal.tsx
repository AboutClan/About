import { useState } from "react";
import styled from "styled-components";

import TabNav, { ITabNavOptions } from "../../../components/molecules/navs/TabNav";
import { IModal } from "../../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../../Modals";
import PointSystemsModalFee from "./PointSystemsModalFee";
import PointSystemsModalPoint from "./PointSystemsModalPoint";

function PointSystemsModal({ setIsModal }: IModal) {
  const [isFirst, setIsFirst] = useState(true);

  const footerOptions: IFooterOptions = {
    main: {},
  };

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "ABOUT 포인트",
      func: () => setIsFirst(true),
      flex: 1,
    },
    {
      text: "스터디 벌금",
      func: () => setIsFirst(false),
      flex: 1,
    },
  ];

  return (
    <ModalLayout
      title="포인트 가이드"
      footerOptions={footerOptions}
      headerOptions={{
        subTitle: "대학색들의 카공 및 친목 동아리 ABOUT",
      }}
      setIsModal={setIsModal}
    >
      <TabNav tabOptionsArr={tabNavOptions} selected={isFirst ? "ABOUT 포인트" : "스터디 벌금"} />
      <Wrapper>{isFirst ? <PointSystemsModalPoint /> : <PointSystemsModalFee />}</Wrapper>
    </ModalLayout>
  );
}

const Wrapper = styled.div`
  height: 100%;
  margin-top: var(--gap-2);
`;

export default PointSystemsModal;
