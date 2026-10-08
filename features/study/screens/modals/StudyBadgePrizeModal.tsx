import { Box } from "@chakra-ui/react";

import InfoCol, { InfoColOptions } from "@/components/atoms/InfoCol";
import { ModalLayout } from "@/components/modals/Modals";
import {
  getStudyBadgePrizeTier,
  STUDY_BADGE_PRIZE_TIERS,
} from "@/constants/serviceConstants/studyConstants/studyBadgeConstant";

interface StudyBadgePrizeModalProps {
  /** 이번 달 내 스탬프 순위. 없으면 순위권 밖. */
  myRank: number | null;
  onClose: () => void;
}

/** 스터디 탭 "이번 달 스탬프" 줄의 선물상자를 누르면 뜨는 월간 랭킹 상품 안내. */
function StudyBadgePrizeModal({ myRank, onClose }: StudyBadgePrizeModalProps) {
  const myTier = getStudyBadgePrizeTier(myRank);

  const prizeArr: InfoColOptions[] = STUDY_BADGE_PRIZE_TIERS.map((tier) => ({
    left: `${tier.from} ~ ${tier.to}등`,
    right: `${tier.emoji} ${tier.label}`,
  }));

  return (
    <ModalLayout title="이번 달 스터디 랭킹 상품" footerOptions={{}} setIsModal={onClose}>
      <InfoCol infoArr={prizeArr} isMint isBig />
      <Box mt={3} fontSize="13px" lineHeight="20px" color="gray.700" textAlign="center">
        {myRank ? (
          <>
            현재 <b>{myRank}위</b>
            {myTier ? ` · ${myTier.label} 구간` : " · 50위 안에 들면 상품"}
          </>
        ) : (
          "50위 안에 들면 상품을 받아요"
        )}
      </Box>
      <Box mt={1} fontSize="11px" lineHeight="16px" color="gray.500" textAlign="center">
        매월 1일 지급 · 동점이면 먼저 달성한 순
      </Box>
    </ModalLayout>
  );
}

export default StudyBadgePrizeModal;
