import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ControlButton from "../../components/ControlButton";
import { Writing2Icon } from "../../components/Icons/ControlButtonIcon";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import TabNav, { ITabNavOptions } from "../../components/molecules/navs/TabNav";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useCheckGuest } from "../../hooks/custom/UserHooks";
import SquareSecretSection from "../../pageTemplates/community/SquareSecretSection";

export const CATEGORY_ARR = ["전체", "일상 · 자유", "팀원모집", "정보공유", "홍보"] as const;
export type CommunityCategory = (typeof CATEGORY_ARR)[number];

function CommunityPage() {
  const router = useRouter();
  const typeToast = useTypeToast();
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
      <Header title="커뮤니티" isBack={false}>
        <Box position="relative">
          <Button onClick={() => {}} variant="unstyled" w={8} h={8} display="flex">
            <UserIcon />
          </Button>
        </Box>
      </Header>
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

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 18 18" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5175 4.11809C10.5175 4.58391 10.4275 5.04518 10.2526 5.47556C10.0777 5.90594 9.82122 6.297 9.49794 6.62642C9.17466 6.95584 8.79086 7.21716 8.36845 7.39547C7.94603 7.57377 7.49329 7.66557 7.03605 7.66562C6.11262 7.66571 5.22698 7.29209 4.57395 6.62693C3.92092 5.96178 3.554 5.05958 3.55391 4.11881C3.55386 3.65299 3.64388 3.19173 3.81881 2.76135C3.99374 2.33097 4.25017 1.9399 4.57345 1.61049C5.22634 0.945195 6.11191 0.571385 7.03534 0.571289C7.95877 0.571193 8.84441 0.944819 9.49744 1.60997C10.1505 2.27513 10.5174 3.17732 10.5175 4.11809M7.0357 8.75078C2.02178 8.75078 0.0714111 12.0016 0.0714111 13.5139C0.0714111 15.0255 4.22324 15.4284 7.0357 15.4284C9.84815 15.4284 14 15.0255 14 13.5139C14 12.0016 12.0496 8.75078 7.0357 8.75078Z"
      fill="var(--color-icon)"
    />
  </svg>
);

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
