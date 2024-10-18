import { Box } from "@chakra-ui/react";
import { useState } from "react";

import CheckList from "../../../components/atoms/CheckList";
import TabNav, { ITabNavOptions } from "../../../components/molecules/navs/TabNav";
import { IModal } from "../../../types/components/modalTypes";
import { IFooterOptions, IHeaderOptions, ModalLayout } from "../../Modals";

function StudyRuleModal({ setIsModal }: IModal) {
  const [isTip, setIsTip] = useState(true);

  const headerOptions: IHeaderOptions = {
    subTitle: "대학생들의 스터디 동아리 ABOUT",
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "확인",
    },
  };

  const tabNavOptions: ITabNavOptions[] = [
    {
      text: "스터디 설명서",
      func: () => setIsTip(true),
    },
    {
      text: "활동 설명서",
      func: () => setIsTip(false),
    },
  ];

  const STUDY_CONTENTS = [
    "스터디를 희망하는 날짜와 장소에 미리! 투표해 주세요! 오후 11시에 결과가 발표됩니다!",
    "3명 이상 겹치는 경우에만 스터디가 오픈됩니다. 눈치보지 말고 먼저! 투표해주세요! 추가 포인트 획득!",
    "참여 인원을 빨리 구하고 싶다면 스터디 페이지의 공유하기를 통해 단톡방에 올려봐요!",
    "당일에도 FREE 오픈을 통해 참여자를 모집할 수 있고, 또는 개인 스터디에 참여할 수도 있습니다!",
    "스터디에 참여해서 포인트도 얻고, 알파벳도 수집하고, 선물도 받고, 공부도 같이 해요!",
  ];

  const ACTIVE_CONTENTS = [
    "각 컨텐츠마다 상단에 가이드가 준비되어 있습니다! 마이페이지도 다양한 기능들이 있으니 방문해봐요!",
    "관심있는 모임이나 소그룹에 참여해 보세요! 또는 직접 개설하고 지원금을 받을 수도 있습니다!",
    "조금만 더 적극적으로 활동해 주세요! 눈치만 보다가는 아무 의미없는 활동이 되기 마련입니다.",
    "더 자세한 설명은 마이페이지의 '자주 묻는 질문'에 가 보시면 종류별 많은 정보가 있습니다!",
    "여러 문의나 건의사항을 항상 환영합니다!",
  ];

  return (
    <ModalLayout
      setIsModal={setIsModal}
      title="동아리 가이드"
      headerOptions={headerOptions}
      footerOptions={footerOptions}
    >
      <TabNav tabOptionsArr={tabNavOptions} selected={isTip ? "스터디 설명서" : "활동 설명서"} />
      <Box h="274px" pt="16px" px="4px">
        <CheckList contents={isTip ? STUDY_CONTENTS : ACTIVE_CONTENTS} />
      </Box>
    </ModalLayout>
  );
}

export default StudyRuleModal;
