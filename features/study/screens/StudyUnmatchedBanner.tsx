import { Box, Button, Flex } from "@chakra-ui/react";

import { XIcon } from "@/components/overlay/AppDownloadModal";

interface StudyUnmatchedBannerProps {
  onOpenStudyList: () => void;
  onApplyOtherDate: () => void;
  onSoloStudy: () => void;
  onClose: () => void;
}

/**
 * 오늘 매칭에 실패했을 때만 노출. 지금까지 실패 사실이 푸시 알림으로만 전달돼
 * 알림을 못 본 사용자는 앱에서 결과를 알 수 없었다.
 *
 * 실패 원인은 적지 않는다 — doAlgorithm은 이유를 추적하지 않으므로(인원 부족·시간
 * 겹침 부족·도달 가능 카페 없음 중 무엇인지 알 수 없다) 단정하면 틀린 안내가 된다.
 * 오늘 공부하러 나가려던 사람에게는 "다른 날짜 신청"이 대안이 아니라서,
 * 이미 확정된 스터디에 바로 참여하는 길을 1순위로 둔다.
 */
function StudyUnmatchedBanner({
  onOpenStudyList,
  onApplyOtherDate,
  onSoloStudy,
  onClose,
}: StudyUnmatchedBannerProps) {
  return (
    <Box
      position="relative"
      p={4}
      borderRadius="14px"
      border="1px solid"
      borderColor="gray.200"
      bg="gray.50"
    >
      <Flex
        as="button"
        type="button"
        aria-label="배너 닫기"
        position="absolute"
        top={2}
        right={2}
        w="32px"
        h="32px"
        align="center"
        justify="center"
        borderRadius="full"
        opacity={0.6}
        _hover={{ opacity: 1 }}
        onClick={onClose}
      >
        <XIcon />
      </Flex>

      <Box fontSize="15px" fontWeight={700} color="gray.800" mb={1} pr={8}>
        오늘은 매칭되지 않았어요
      </Box>
      <Box fontSize="12.5px" color="gray.600" lineHeight="18px" mb={3} pr={6}>
        오늘 이미 확정된 스터디가 있으면 바로 참여할 수 있어요.
      </Box>
      <Flex gap={2} mb={2}>
        <Button flex={1} size="sm" colorScheme="mint" borderRadius="8px" onClick={onOpenStudyList}>
          열린 스터디 보기
        </Button>
        <Button flex={1} size="sm" variant="outline" borderRadius="8px" onClick={onSoloStudy}>
          개인 공부 인증
        </Button>
      </Flex>
      <Box
        as="button"
        type="button"
        w="100%"
        py={1}
        fontSize="12px"
        fontWeight={500}
        color="gray.500"
        textDecoration="underline"
        onClick={onApplyOtherDate}
      >
        다른 날짜로 스터디 신청
      </Box>
    </Box>
  );
}

export default StudyUnmatchedBanner;
