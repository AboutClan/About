import { IModal } from "../../types/components/modalTypes";
import RuleModal, { IRuleModalContent } from "../RuleModal";

function StoreRuleModal({ setIsModal }: IModal) {
  const content: IRuleModalContent = {
    headerContent: {
      title: "포인트 추첨",
      text: "활동을 통해 적립한 포인트로 추첨에 응모해보세요! 다양한 상품들이 준비되어 있습니다!",
    },
    mainContent: [
      {
        title: "포인트는 어떻게 얻나요?",
        texts: ["스터디에 참여하거나, 이벤트, 건의, 홍보 등을 통해 포인트를 흭득할 수 있어요!"],
      },
      {
        title: "응모는 어떤 걸 하는 게 좋나요?",
        texts: [
          "모든 상품의 기대 가성비는 거의 동일해요! 머리 아프게 고민하지 말고 원하시는 것으로 응모하시면 됩니다!",
        ],
      },
      {
        title: "상품 마다 인원수가 있는 건 뭔가요?",
        texts: [
          "예측 가능한 당첨이 될 수 있도록 최대 응모 횟수와 당첨 숫자를 제한하고 있어요. 트로피의 숫자는 당첨 개수이고, 아래의 숫자는 현재 응모 인원과 최대 응모 가능 인원이에요!",
        ],
      },
      {
        title: "결과 발표는 언제인가요?",
        texts: [
          " 응모 인원의 수가 모두 충족되면 결과가 발표돼요! 균일한 확률을 유지하기 위해 마감일을 따로 두지 않고 있어요.",
        ],
      },
    ],
  };

  return <RuleModal content={content} setIsModal={setIsModal} />;
}

export default StoreRuleModal;
