import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import WritingButton from "../../components/atoms/buttons/WritingButton";
import Slide from "../../components/layouts/PageSlide";
import SquareSecretSection from "../../pageTemplates/square/SquareSecretSection";
import { SquareTab } from "../../pageTemplates/square/SquareTabNav";

function SquarePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as "secret" | "lounge";
  const isGuest = session?.user.name === "guest";

  const [tab, setTab] = useState<SquareTab>("시크릿 스퀘어");
  // const [isRuleModal, setIsRuleModal] = useState(false);

  useEffect(() => {
    if (!tabParam) {
      router.replace("/square?tab=secret");
      setTab("시크릿 스퀘어");
      return;
    }
    if (tabParam === "secret") setTab("시크릿 스퀘어");
    if (tabParam === "lounge") setTab("라운지");
  }, [tabParam]);

  return (
    <>
      <Slide isNoPadding>
        <SquareSecretSection />
      </Slide>
      {tab === "시크릿 스퀘어" && !isGuest && <WritingButton url="/square/secret/writing" />}
      {/* {isRuleModal && (
        <RuleModal
          content={tab === "시크릿 스퀘어" ? SECRET_CONTENT : LOUNGE_CONTENT}
          setIsModal={setIsRuleModal}
        />
      )} */}
    </>
  );
}

// const LOUNGE_CONTENT: IRuleModalContent = {
//   mainContent: [
//     {
//       title: "라운지 설명",

//       texts: [
//         "번개 게시글 또는 소모임 피드에서 작성 가능",
//         "리뷰/피드 작성시 200 point 획득 !",
//         "좋아요 누르기 or 댓글 작성 만으로도 포인트 획득 !",
//       ],
//     },
//   ],
//   headerContent: {
//     title: "라운지",
//     text: "번개 리뷰나 소모임 피드를 확인할 수 있습니다.",
//   },
// };
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

export default SquarePage;
