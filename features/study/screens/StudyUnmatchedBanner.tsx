import { Box, Button, Flex } from "@chakra-ui/react";

interface StudyUnmatchedBannerProps {
  onApplyOtherDate: () => void;
  onSoloStudy: () => void;
}

/**
 * 오늘 매칭에 실패했을 때만 노출. 지금까지 실패 사실이 푸시 알림으로만 전달돼
 * 알림을 못 본 사용자는 앱에서 결과를 알 수 없었다.
 */
function StudyUnmatchedBanner({ onApplyOtherDate, onSoloStudy }: StudyUnmatchedBannerProps) {
  return (
    <Box p={4} borderRadius="14px" border="1px solid" borderColor="gray.200" bg="gray.50">
      <Box fontSize="15px" fontWeight={700} color="gray.800" mb={1}>
        오늘은 매칭되지 않았어요
      </Box>
      <Box fontSize="12.5px" color="gray.600" lineHeight="18px" mb={3}>
        범위 내 신청 인원이 3명에 못 미쳤어요. 다른 날짜로 신청하거나 개인 공부 인증에 참여해
        보세요.
      </Box>
      <Flex gap={2}>
        <Button flex={1} size="sm" colorScheme="mint" borderRadius="8px" onClick={onApplyOtherDate}>
          다른 날짜로 스터디 신청
        </Button>
        <Button flex={1} size="sm" variant="outline" borderRadius="8px" onClick={onSoloStudy}>
          개인 공부 인증
        </Button>
      </Flex>
    </Box>
  );
}

export default StudyUnmatchedBanner;
