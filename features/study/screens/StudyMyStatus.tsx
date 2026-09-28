import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo } from "react";

import { ShortArrowIcon } from "@/components/Icons/ArrowIcons";
import { StarIcon } from "@/components/Icons/StarIcons";
import InfoBoxCol, { InfoBoxProps } from "@/components/molecules/InfoBoxCol";
import {
  getStudyBadgeGoalTier,
  getStudyBadgePrizeTier,
} from "@/constants/serviceConstants/studyConstants/studyBadgeConstant";
import { StudyBadgeRankingProps } from "@/features/study/hooks/queries";
import { StudyWeekSetProps } from "@/types/models/studyTypes/study-set.types";
import { dayjsToFormat } from "@/utils/dateTimeUtils";

interface StudyMyStatusProps {
  studySet: StudyWeekSetProps;
  myId: string;
  badgeRanking: StudyBadgeRankingProps;
  onOpenRanking: () => void;
}

/**
 * 스터디 탭 상단의 내 현황.
 *
 * 라벨–값 두 줄은 손으로 짜지 않고 InfoBoxCol에 맡긴다. 어바웃에서 이 패턴은
 * 28개 파일이 같은 컴포넌트를 쓰고 있어서, 직접 만들면 이 카드만 패딩·구분선·
 * 글자 크기가 다른 규칙을 갖게 된다.
 *
 * 카드 제목은 두지 않는다 — 어바웃의 강조 카드는 16px/800 제목을 갖지만, 이 블록은
 * 아래 스터디 카드 목록이 주인공인 화면의 머리에 있어서 높이를 26px 쓰는 제목보다
 * 두 라벨로 충분하다고 판단했다. 그만큼 시스템 관행에서 벗어난 지점이다.
 *
 * 값은 모두 InfoBoxCol의 우측 열에 모은다 — 날짜·스탬프 개수·순위 셋 중 하나만
 * 본문 문장 속에 있으면 값으로 읽히지 않는다. 그래서 순위는 스탬프 행의 값에 붙였다.
 *
 * 컴포넌트 밖 자유 텍스트는 한 줄, 그것도 값이 들어 있지 않은 안내문만 둔다.
 * 적립 규칙(신청 1개 · 출석 1개)은 스탬프 안내 모달에 있으므로 여기서 반복하지 않는다.
 *
 * 남은 한 줄(보상 목표)은 왼쪽 정렬이다. 오른쪽 정렬은 InfoBoxCol의 값에만 쓰는
 * 것이 어바웃의 관행이고, 문장을 오른쪽에 붙이면 줄마다 읽기 시작점이 달라진다.
 * 강조도 스탬프 개수 하나로 제한한다.
 */
function StudyMyStatus({ studySet, myId, badgeRanking, onOpenRanking }: StudyMyStatusProps) {
  const { myBadgeCnt, myRank, ranking } = badgeRanking;

  /**
   * 신청해 둔 날짜. vote2/mine은 확정된 결과만 주므로 주간 응답의 participations에서
   * 내 것을 뽑아 쓴다. 확정된 날짜는 participations가 비므로 여기 남은 건 전부 대기 중이다.
   */
  const applyDates = useMemo(() => {
    if (!studySet?.participations || !myId) return [];

    return studySet.participations
      .filter((participation) => participation.study.some((s) => s.user._id === myId))
      .map((participation) => participation.date);
  }, [studySet?.participations, myId]);

  const goalTier = getStudyBadgeGoalTier(myRank);

  // 더 올라갈 구간이 없을 때(1~5등) 말할 것은 목표가 아니라 지금 받게 될 보상이다.
  const currentTier = getStudyBadgePrizeTier(myRank);

  /**
   * 목표 구간까지 남은 스탬프 수. 경계에 있는 사람보다 1개는 더 모아야 한다 —
   * 동점이면 먼저 달성한 사람이 상위이므로 같은 개수로는 순위를 넘지 못한다.
   * 아직 그 등수까지 사람이 차지 않았으면 스탬프 1개로 구간에 들어간다.
   */
  const boundary = goalTier ? ranking?.[goalTier.to - 1] : null;
  const targetCnt = goalTier ? (boundary ? boundary.badgeCnt + 1 : 1) : 0;
  const remainCnt = goalTier ? Math.max(targetCnt - myBadgeCnt, 1) : 0;

  const infoBoxPropsArr: InfoBoxProps[] = [
    {
      category: "신청중인 날짜",
      text: applyDates.length
        ? applyDates.map((date) => dayjsToFormat(dayjs(date), "M/D(ddd)")).join(", ")
        : "없음",
    },
    {
      category: "이번 달 스탬프",
      rightChildren: (
        <Flex align="center" justify="flex-end" gap={2}>
          {/* 일일 출석 스탬프와 같은 별 아이콘을 쓴다. */}
          <Flex
            w="22px"
            h="22px"
            align="center"
            justify="center"
            borderRadius="50%"
            bg="mint"
            sx={{ svg: { width: "12px", height: "12px" } }}
          >
            <StarIcon />
          </Flex>
          <Box fontSize="16px" fontWeight="bold" lineHeight="22px" color="gray.800">
            {myBadgeCnt}개
          </Box>
          {/*
            순위도 값이므로 같은 우측 열에 둔다. 무게로만 주·부를 가른다.
            스탬프가 0개면 서버가 순위를 null로 주는데, 자리를 비우면 값 열이
            들쭉날쭉해지므로 랭킹 페이지와 같은 "순위권 외"로 채운다.
          */}
          <Box fontSize="12px" color="gray.300">
            ·
          </Box>
          <Box fontSize="12px" fontWeight={600} color={myRank ? "gray.600" : "gray.400"}>
            {myRank ? `${myRank}위` : "순위권 외"}
          </Box>
        </Flex>
      ),
    },
  ];

  return (
    <Box px={4} py={3} border="var(--border-main)" borderRadius="8px" bg="white">
      <InfoBoxCol infoBoxPropsArr={infoBoxPropsArr} />

      {/*
        보상 목표 한 줄과 그 끝의 랭킹 링크. 값이 없는 안내문이라 링크와 한 줄을 써도
        서로 가리지 않는다. 순위 표기는 랭킹 페이지와 같은 "위"를 쓴다.
      */}
      <Flex align="center" justify="space-between" gap={2} mt={2}>
        <Box fontSize="11px" lineHeight="16px" color="gray.500" isTruncated>
          {goalTier ? (
            <>
              {/* 사람마다·달마다 달라지는 두 조각만 민트로 집는다. */}
              <Box as="span" color="mint">
                {remainCnt}개
              </Box>{" "}
              더 모으면{" "}
              <Box as="span" color="mint">
                {goalTier.label}
              </Box>{" "}
              지급!
            </>
          ) : currentTier ? (
            <>
              월간 정산 때{" "}
              <Box as="span" color="mint">
                {currentTier.label}
              </Box>{" "}
              지급 예정!
            </>
          ) : (
            "가장 높은 보상 구간이에요"
          )}
        </Box>
        <Flex
          as="button"
          type="button"
          align="center"
          gap={0.5}
          flexShrink={0}
          pl={2}
          py={2}
          fontSize="12px"
          fontWeight="bold"
          color="mint"
          onClick={onOpenRanking}
        >
          랭킹
          <ShortArrowIcon dir="right" color="mint" />
        </Flex>
      </Flex>
    </Box>
  );
}

export default StudyMyStatus;
