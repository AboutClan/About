import { Box } from "@chakra-ui/react";
import InfoList from "../../../components/atoms/lists/InfoList";

interface GatherGuideProps {}

function GatherGuide({}: GatherGuideProps) {
  return (
    <Box mt={10} mx={5}>
      <Box mb={2} fontSize="16px" fontWeight="semibold">
        번개 모임 안내
      </Box>

      <InfoList
        items={[
          "참여 시 티켓 1장이 소모됩니다. (취소되면 자동 반환)",
          "승인제 모임에서 승인 여부는 100% 모임장이 결정합니다.",
          "모임 종료 후에는 멤버 후기 평가를 할 수 있습니다.",
          "임시 보증금 2,000원이 차감되고, 모임 종료 후 반환됩니다.",
          "노쇼 패널티: 하루 전 취소 1000원 반환. 당일 취소는 미반환.",
          "모인 벌금은 모임장에게 자동 지급됩니다.",
        ]}
      />
    </Box>
  );
}

export default GatherGuide;
