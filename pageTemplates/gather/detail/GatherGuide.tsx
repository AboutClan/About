import { Box } from "@chakra-ui/react";

import InfoList from "../../../components/atoms/lists/InfoList";

interface GatherGuideProps {
  isAdmin: boolean;
}

function GatherGuide({ isAdmin }: GatherGuideProps) {
  return (
    <>
      {isAdmin && (
        <Box mt={10} mx={5}>
          <Box mb={2} fontSize="16px" fontWeight="semibold">
            번개 모임장 안내
          </Box>
          <InfoList
            items={[
              "멤버 프로필에서 연락처를 확인할 수 있습니다.",
              "우측 상단 설정 버튼에서 다양한 기능을 확인할 수 있어요.",
              "모임 종료 후, 설정에서 불참 인원을 체크할 수 있습니다.",
              "불참자의 보증금은 포인트로 모임장에게 지급됩니다.",
              "진행 중 어려운 점이 있다면 About 채널에 문의해 주세요.",
              "후기 작성까지 완료하면 지원금 신청이 가능합니다.",
              "분위기를 해치는 멤버가 있다면 즉시 신고해 주세요.",
            ]}
            isLight
          />
        </Box>
      )}
      <Box mt={10} mx={5}>
        <Box mb={2} fontSize="16px" fontWeight="semibold">
          번개 모임 안내
        </Box>
        <InfoList
          items={[
            "모임 안내를 위해 모임장에게 연락처가 공개될 수 있습니다.",
            "참여 시 티켓 1장이 소모됩니다. (취소 시 자동 반환)",
            "모임 종료 후, 멤버 후기 평가를 할 수 있습니다.",
            "승인제 모임의 경우, 승인 여부는 모임장이 결정합니다.",
            "임시 보증금 2,000원이 차감되며, 모임 종료 후 반환됩니다.",
            "노쇼: 하루 전 취소는 1,000원 반환 / 당일 취소는 미반환",
            "비매너 노쇼로 신고되는 경우, 최대 5,000원의 벌금이 부과됩니다.",
          ]}
          isLight
        />
      </Box>
    </>
  );
}

export default GatherGuide;
