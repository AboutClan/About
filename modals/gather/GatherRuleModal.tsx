import { IModal } from "../../types/hooks/reactTypes";
import RuleModal, { IRuleModalContent } from "../RuleModal";

function GatherRuleModal({ setIsModal }: IModal) {
  const content: IRuleModalContent = {
    headerContent: {
      title: "모임 게시판",
      text: "다양한 주제의 모임과 번개를 개설하거나 참여할 수 있어요! 재밌는 모임 같이 참여해요~!",
    },
    mainContent: [
      {
        title: "ABOUT 모임 게시판은 어떤게 다르나요?",
        texts: [
          "누구나 모임을 개설할 수 있어요! 날짜와 장소, 주제를 선택해서 모임을 열어봐요!",
          "필요한 내용들을 형식화해서 쉽게 모임을 열 수 있어요!",
          "주제, 장소, 참여시간, 진행방식 등의 요소들을 한 눈에 볼 수 있어서 따로 고민하거나 설명하지 않아도 진행이 간단해요!",
          "같은 동아리여도 초면인 사람들이 많아서 모임에 나가기가 고민될 수 있어요! 인원 수, 성별, 나이 등을 고려하여 참여자를 받을 수 있어서 새로운 만남에 대한 부담이 적어요!",
        ],
      },
      {
        title: "모임 개설자 필독",
        texts: [
          "카카오톡 공유를 통해 모임글을 공지 톡방에 올려주세요!",
          "모임이 확정되면 인원들과 단톡방을 만들어주세요!",
          "모임 취소는 신청자가 없는 경우 완전히 삭제되고, 신청자가 있는 경우에는 취소 상태로 변경됩니다.",
          "모임 진행시 간단한 인증 사진을 찍어주세요!",
        ],
      },
    ],
  };

  return <RuleModal content={content} setIsModal={setIsModal} />;
}

export default GatherRuleModal;
