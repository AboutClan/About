import { useSession } from "next-auth/react";

import WritingButton from "../../components/atoms/buttons/WritingButton";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import SquareSecretSection from "../../pageTemplates/community/SquareSecretSection";

function BoardPage() {
  const { data: session } = useSession();

  const isGuest = session?.user.name === "guest";

  // const [isRuleModal, setIsRuleModal] = useState(false);

  return (
    <>
      <Header title="커뮤니티"></Header>
      <Slide isNoPadding>
        <SquareSecretSection />
      </Slide>
      {!isGuest && <WritingButton isBottomNav={false} url="/community/writing" />}
      {/* {isRuleModal && <RuleModal content={SECRET_CONTENT} setIsModal={setIsRuleModal} />} */}
    </>
  );
}

// const SECRET_CONTENT: IRuleModalContent = {
//   mainContent: [
//     {
//       title: "시크릿 스퀘어 설명",

//       texts: [
//         "익명성이 보장됩니다.",
//         "주제에 상관없이 다양한 소통 가능",
//         "보유중인 아바타 중 선택하여 사용 가능(예정)",
//       ],
//     },
//   ],
//   headerContent: {
//     title: "시크릿 스퀘어",
//     text: "익명으로 소통을 할 수 있는 커뮤니티",
//   },
// };

export default BoardPage;
