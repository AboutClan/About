import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import RuleIcon from "../../components/atoms/Icons/RuleIcon";
import WritingIcon from "../../components/atoms/Icons/WritingIcon";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import RuleModal, { IRuleModalContent } from "../../modals/RuleModal";
import SquareLoungeSection from "../../pageTemplates/square/SquareLoungeSection";
import SquareSecretSection from "../../pageTemplates/square/SquareSecretSection";
import SquareTabNav, { SquareTab } from "../../pageTemplates/square/SquareTabNav";

function SquarePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as "secret" | "lounge";

  const [tab, setTab] = useState<SquareTab>("시크릿 스퀘어");
  const [isRuleModal, setIsRuleModal] = useState(false);
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
      <Header title="커뮤니티" isBack={false}>
        <RuleIcon setIsModal={setIsRuleModal} />
      </Header>
      <Slide>
        <SquareTabNav tab={tab} />
        {tab === "시크릿 스퀘어" ? <SquareSecretSection /> : <SquareLoungeSection />}
      </Slide>
      {tab === "시크릿 스퀘어" && <WritingIcon url="/square/secret/writing" />}
      {isRuleModal && (
        <RuleModal
          content={tab === "시크릿 스퀘어" ? SECRET_CONTENT : LOUNGE_CONTENT}
          setIsModal={setIsRuleModal}
        />
      )}
    </>
  );
}

const LOUNGE_CONTENT: IRuleModalContent = {
  mainContent: [
    {
      title: "라운지 설명",

      texts: [
        "번개 게시글 또는 소모임 피드에서 작성 가능",
        "리뷰/피드 작성시 200 point 획득 !",
        "좋아요 누르기 or 댓글 작성 만으로도 포인트 획득 !",
      ],
    },
  ],
  headerContent: {
    title: "라운지",
    text: "번개 리뷰나 소모임 피드를 확인할 수 있습니다.",
  },
};
const SECRET_CONTENT: IRuleModalContent = {
  mainContent: [
    {
      title: "시크릿 스퀘어 설명",

      texts: [
        "익명성이 보장됩니다.",
        "주제에 상관없이 다양한 소통 가능",
        "보유중인 아바타 중 선택하여 사용 가능(예정)",
      ],
    },
  ],
  headerContent: {
    title: "시크릿 스퀘어",
    text: "익명으로 자유로운 소통을 할 수 있는 커뮤니티",
  },
};

export default SquarePage;
