import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ControlButton from "@/components/ControlButton";
import { Writing2Icon } from "@/components/Icons/ControlButtonIcon";
import Header from "@/components/layouts/Header";
import Slide from "@/components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "@/components/molecules/navs/TabNav";
import SquareSecretSection from "@/features/community/screens/SquareSecretSection";
import { useCheckGuest } from "@/hooks/custom/UserHooks";

export const CATEGORY_ARR = ["전체", "일상 · 자유", "팀원모집", "정보공유", "홍보"] as const;
export type CommunityCategory = (typeof CATEGORY_ARR)[number];

function CommunityPage() {
  const router = useRouter();

  const isGuest = useCheckGuest();

  const [tab, setTab] = useState<CommunityCategory>("전체");

  const tabOptions: ITabNavOptions[] = CATEGORY_ARR.map((c) => ({
    text: c,
    func: () => {
      const idx = CATEGORY_ARR.findIndex((category) => category === c);
      setTab(c);
      router.replace(`/community?tab=${idx}`);
    },
  }));

  return (
    <>
      <Header title="커뮤니티" isBack={false} />
      <Slide isNoPadding>
        <Box fontSize="16px" mb={3} bgColor="white" borderBottom="var(--border)" px={5}>
          <TabNav tabOptionsArr={tabOptions} selected={tab} isMain isBlack />
        </Box>
        <SquareSecretSection category={tab} />
      </Slide>
      {isGuest === false && (
        <ControlButton
          text="글쓰기"
          rightIcon={<Writing2Icon />}
          hasBottomNav
          handleClick={() => {
            router.push(`/community/writing`);
          }}
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

export default CommunityPage;
