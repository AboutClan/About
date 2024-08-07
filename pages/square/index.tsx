import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import RuleIcon from "../../components/atoms/Icons/RuleIcon";
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
      router.replace("/square?tab=lounge");
      setTab("라운지");
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
      {/* {tab === "시크릿 스퀘어" && <WritingIcon url="/square/writing" />} */}
      {isRuleModal && <RuleModal content={CONTENT} setIsModal={setIsRuleModal} />}
    </>
  );
}

const CONTENT: IRuleModalContent = {
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

export default SquarePage;
