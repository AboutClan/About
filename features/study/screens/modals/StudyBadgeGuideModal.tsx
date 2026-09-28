import { Box } from "@chakra-ui/react";

import InfoCol, { InfoColOptions } from "@/components/atoms/InfoCol";
import { ModalLayout } from "@/components/modals/Modals";
import {
  STUDY_BADGE_PRIZE_TIERS,
  STUDY_BADGE_RULES,
} from "@/constants/serviceConstants/studyConstants/studyBadgeConstant";

interface StudyBadgeGuideModalProps {
  onClose: () => void;
}

/**
 * 스탬프를 어떻게 얻고 무엇으로 바뀌는지. 서버 정산 구간과 같은 상수를 읽으므로
 * 보상이 바뀌면 studyBadgeConstant 한 곳만 고치면 된다.
 */
function StudyBadgeGuideModal({ onClose }: StudyBadgeGuideModalProps) {
  const earnArr: InfoColOptions[] = STUDY_BADGE_RULES.map((rule) => ({
    left: rule.label,
    right: `스탬프 ${rule.cnt}개`,
  }));

  const prizeArr: InfoColOptions[] = STUDY_BADGE_PRIZE_TIERS.map((tier) => ({
    left: `${tier.from} ~ ${tier.to}등`,
    right: `${tier.emoji} ${tier.label}`,
  }));

  return (
    <ModalLayout title="스터디 스탬프 안내" footerOptions={{ main: {} }} setIsModal={onClose}>
      <Box mb={4} fontSize="13px" lineHeight="20px" color="gray.700">
        스터디에 참여하면 <b>스탬프</b>가 쌓여요!
        <br />
        매월 <b>1일에 초기화</b>되고, 그 달에 모은 개수로 <b>스터디 랭킹</b>과 보상이 정해집니다.
      </Box>

      <Box mb={2} fontSize="12px" fontWeight={700} color="gray.700">
        스탬프 받는 방법
      </Box>
      <InfoCol infoArr={earnArr} isMint isBig />

      {/* 신청 스탬프는 매칭 결과와 무관하게 준다 — 신청했다가 취소하지 않으면 그대로 남는다. */}
      <Box mt={2} fontSize="11px" lineHeight="16px" color="gray.500">
        정규 매칭 신청 스탬프는 <b>매칭이 안 돼도</b> 그대로 남아요. 같은 날짜에 여러 번 신청해도 하루
        1개입니다.
      </Box>

      <Box mt={5} mb={2} fontSize="12px" fontWeight={700} color="gray.700">
        매월 1일 랭킹 보상
      </Box>
      <InfoCol infoArr={prizeArr} isMint isBig />

      <Box mt={2} fontSize="11px" lineHeight="16px" color="gray.500">
        스탬프 개수가 같으면 <b>먼저 달성한 분</b>이 상위예요.
      </Box>
    </ModalLayout>
  );
}

export default StudyBadgeGuideModal;
