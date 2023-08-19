import styled from "styled-components";
import RuleModal, {
  IRuleModalContent,
} from "../../components/common/modal/RuleModal";
import { IModal } from "../../types/reactTypes";

function PromotionRuleModal({ setIsModal }: IModal) {
  const content: IRuleModalContent = {
    headerContent: {
      title: "홍보 페이지",
      text: "본인 학교 에브리타임에 동아리 홍보글을 작성해주시면와 추첨을 통해 매 달BBQ 황금 올리브 치킨 세트를 드립니다! 중복 지원도 가능하니까 생각나실 때 여러번 지원해주시면 더 감사합니다 ^^...",
    },
    mainContent: [
      {
        title: "포인트는 어떻게 얻나요?",
        texts: [
          "스터디에 참여하거나, 이벤트, 건의, 홍보 등을 통해 포인트를 흭득할 수 있어요!",
        ],
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
    ],
  };
  return <RuleModal content={content} setIsModal={setIsModal} />;
}

const Layout = styled.div``;

export default PromotionRuleModal;
