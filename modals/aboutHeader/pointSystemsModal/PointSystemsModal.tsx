import { Box } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

import CheckList from "../../../components/atoms/CheckList";
import TabNav, { ITabNavOptions } from "../../../components/molecules/navs/TabNav";
import { IModal } from "../../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../../Modals";
import PointSystemsModalPoint from "./PointSystemsModalPoint";

function PointSystemsModal({ setIsModal }: IModal) {
  const [isFirst, setIsFirst] = useState(true);

  const footerOptions: IFooterOptions = {
    main: {},
  };

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "포인트 가이드",
      func: () => setIsFirst(true),
      flex: 1,
    },
    {
      text: "서비스 소개",
      func: () => setIsFirst(false),
      flex: 1,
    },
  ];

  const ACTIVE_CONTENTS = [
    "오후 11시에 스터디 결과가 발표됩니다. 투표 순서대로 몇배의 추가 포인트를 획득하니 먼저 투표해주세요!",
    "친구 초대 또는 단톡방에 스터디 공유를 통해 더 빠른 인원 모집을 할 수 있습니다.",
    "스터디 매칭에 실패한 경우 자유 스터디로 오픈 또는 개인 스터디로 전환이 가능합니다.",
    "관심있는 모임이나 소그룹에 참여해 보세요! 또는 직접 개설하고 지원금을 받을 수도 있습니다!",
    "더 자세한 설명은 마이페이지의 '자주 묻는 질문'에 가 보시면 종류별 많은 정보가 있습니다!",
  ];

  return (
    <ModalLayout
      title="동아리 가이드"
      footerOptions={footerOptions}
      headerOptions={{
        subTitle: "대학색들의 카공 및 친목 동아리 ABOUT",
      }}
      setIsModal={setIsModal}
    >
      <TabNav tabOptionsArr={tabNavOptions} selected={isFirst ? "포인트 가이드" : "서비스 소개"} />
      <Wrapper>
        {isFirst ? (
          <PointSystemsModalPoint />
        ) : (
          <Box pt="16px">
            <CheckList contents={ACTIVE_CONTENTS} />
          </Box>
        )}
      </Wrapper>
    </ModalLayout>
  );
}

const Wrapper = styled.div`
  height: 288px;
  margin-top: var(--gap-2);
`;

export default PointSystemsModal;
