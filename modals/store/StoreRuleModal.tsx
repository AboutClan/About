import { IModal } from "../../types/components/modalTypes";
import RuleModal, { IRuleModalContent } from "../RuleModal";

function StoreRuleModal({ setIsModal }: IModal) {
  const content: IRuleModalContent = {
    headerContent: {
      title: "포인트 추첨",
      text: "동아리 활동을 통해 포인트를 모으고 추첨에 응모해보세요! 다양한 상품이 있습니다 ~!",
    },
    mainContent: [
      {
        title: "포인트는 어떻게 얻나요?",
        texts: [
          "스터디 참여, 출석체크, 이벤트, 건의, 홍보 등 여러 컨텐츠에서 포인트를 흭득할 수 있어요!",
        ],
      },

      {
        title: "상품 당첨과 인원 관련해서 궁금해요.",
        texts: ["트로피의 숫자는 당첨 개수, 왼쪽 숫자는 현재 인원과 최대 응모 가능한 인원이에요!"],
      },
      {
        title: "응모 최대 개수에 제한이 있나요?",
        texts: [
          "네. 상품 당 중복해서 투표할 수 있는 숫자는 유저 개인 등급에 따라 달라집니다. 기본 아메리카노는 1개, 이후 등급이 오를때마다 하나씩 더 추가돼요.",
        ],
      },
    ],
  };

  return <RuleModal content={content} setIsModal={setIsModal} />;
}

export default StoreRuleModal;
