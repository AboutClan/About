import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import WritingButton from "../../components/atoms/buttons/WritingButton";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import SquareInfoSection from "../../pageTemplates/community/SquareInfoSection";
import SquareSecretSection from "../../pageTemplates/community/SquareSecretSection";

function BoardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const typeParams = searchParams.get("type") as "info" | "anonymous";
  const { data: session } = useSession();

  const isGuest = session?.user.name === "guest";

  const [tab, setTab] = useState<"정보 게시판" | "익명 게시판">("정보 게시판");

  // const [isRuleModal, setIsRuleModal] = useState(false);
  console.log(typeParams);

  useEffect(() => {
    console.log(34, typeParams);
    if (typeParams === "info") setTab("정보 게시판");
    if (typeParams === "anonymous") setTab("익명 게시판");
  }, [typeParams]);

  const tabOptions: ITabNavOptions[] = [
    {
      text: "정보 게시판",
      func: () => {
        newSearchParams.set("type", "info");
        router.replace(`/community?${newSearchParams.toString()}`);
        setTab("정보 게시판");
      },
    },
    {
      text: "익명 게시판",
      func: () => {
        newSearchParams.set("type", "anonymous");
        router.replace(`/community?${newSearchParams.toString()}`);
        setTab("익명 게시판");
      },
    },
  ];

  return (
    <>
      <Header title="커뮤니티" url="/home"></Header>
      <Slide isNoPadding>
        <TabNav tabOptionsArr={tabOptions} selected={tab} isFullSize />
        {tab === "정보 게시판" ? <SquareInfoSection /> : <SquareSecretSection />}
      </Slide>
      {!isGuest && (
        <WritingButton
          isBottomNav={false}
          url={`/community/writing?type=${tab === "익명 게시판" ? "anonymous" : "info"}`}
        />
      )}
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
