import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import { useState } from "react";

import Avatar from "@/components/atoms/Avatar";
import { MainLoadingAbsolute } from "@/components/atoms/loaders/MainLoading";
import { CheckCircleIcon } from "@/components/Icons/CircleIcons";
import {
  StudyRegionMemberProps,
  useStudyRegionMembersQuery,
} from "@/features/study/hooks/queries";
import { maskUserName } from "@/utils/stringUtils";

/** 처음에 펼쳐 둘 구 수. 나머지는 "지역 더보기"로. */
const INITIAL_REGION_CNT = 5;
/** 구마다 보여 줄 미니 프로필 수(6명 × 최대 3줄). 넘치면 마지막 칸에 "+N". */
const MEMBERS_PER_REGION = 18;

interface StudyRegionMembersProps {
  /** 게스트·카공지도면 이름을 마스킹한다. */
  isCafeMap?: boolean;
}

/**
 * 라운지 "지역 멤버" 탭(스터디 크루 대체).
 *
 * 상세 정보가 아니라 "구마다 누가 있는지"를 한눈에 보는 용도다. 구별로 아바타·이름만 격자로 나열하고,
 * 이번 주 신청 중인 사람은 앞에 두고 체크 배지를 붙인다. 아바타는 눌러도 프로필이 열리지 않는다
 * (확정 전 신청자 프로필 비공개 규칙).
 */
function StudyRegionMembers({ isCafeMap = false }: StudyRegionMembersProps) {
  const [isAllRegions, setIsAllRegions] = useState(false);
  // "+N"을 눌러 전부 펼친 지역들.
  const [expanded, setExpanded] = useState<string[]>([]);
  const { data, isLoading } = useStudyRegionMembersQuery();

  if (isLoading && !data) {
    return (
      <Box pos="relative" minH="240px">
        <MainLoadingAbsolute size="sm" />
      </Box>
    );
  }

  if (!data?.regions.length) {
    return (
      <Box py={10} textAlign="center" fontSize="13px" color="gray.500">
        아직 스터디를 신청한 멤버가 없어요.
      </Box>
    );
  }

  const regions = isAllRegions ? data.regions : data.regions.slice(0, INITIAL_REGION_CNT);

  return (
    <Box>
      {/* 실제 기준은 서버 getRegionMembers의 REGION_ACTIVITY_DAYS(90일). 문구에는 기간을 적지 않는다. */}
      <Box mb={4} fontSize="12px" lineHeight="18px" color="gray.500">
        최근 스터디를 신청한 멤버예요.
      </Box>
      {regions.map((region) => (
        <Box key={region.name} id={`region-${region.name}`} mb={6} scrollMarginTop="72px">
          <Flex align="baseline" justify="space-between" mb={3}>
            <Box fontSize="15px" fontWeight="bold" color="gray.800">
              {region.name}{" "}
              <Box as="span" fontSize="13px" fontWeight={500} color="gray.500">
                {region.count}명
              </Box>
            </Box>
            {region.applyingCount > 0 && (
              <Box fontSize="12px" fontWeight={600} color="mint">
                이번 주 {region.applyingCount}명 신청 중
              </Box>
            )}
          </Flex>
          <Grid templateColumns="repeat(6, 1fr)" rowGap={3} columnGap={1}>
            {(expanded.includes(region.name)
              ? region.members
              : region.members.slice(0, MEMBERS_PER_REGION)
            ).map((member, idx) => {
              const rest = region.members.length - MEMBERS_PER_REGION;
              const isLastSlot =
                !expanded.includes(region.name) && idx === MEMBERS_PER_REGION - 1 && rest > 0;
              return isLastSlot ? (
                <MoreTile
                  key="more"
                  count={rest + 1}
                  onClick={() => setExpanded((old) => [...old, region.name])}
                />
              ) : (
                <MiniProfile key={member.user._id} member={member} isMasked={isCafeMap} />
              );
            })}
          </Grid>
          {expanded.includes(region.name) && region.members.length > MEMBERS_PER_REGION && (
            <Flex justify="center" mt={3}>
              <Box
                as="button"
                type="button"
                px={3}
                py={1}
                fontSize="12px"
                color="gray.500"
                onClick={() => {
                  setExpanded((old) => old.filter((name) => name !== region.name));
                  // 길게 펼친 목록을 접으면 화면이 그 지역 제목보다 한참 아래에 남는다. 제목으로 되돌린다.
                  document
                    .getElementById(`region-${region.name}`)
                    ?.scrollIntoView({ block: "start", behavior: "smooth" });
                }}
              >
                접기 ▲
              </Box>
            </Flex>
          )}
        </Box>
      ))}

      {!isAllRegions && data.regions.length > INITIAL_REGION_CNT && (
        <Button
          w="100%"
          h="40px"
          bgColor="white"
          border="0.5px solid #E8E8E8"
          fontSize="13px"
          fontWeight={500}
          color="gray.600"
          onClick={() => setIsAllRegions(true)}
        >
          지역 더보기 ({data.regions.length - INITIAL_REGION_CNT}곳)
        </Button>
      )}
    </Box>
  );
}

function MiniProfile({ member, isMasked }: { member: StudyRegionMemberProps; isMasked: boolean }) {
  // 닉네임이 아니라 실명을 쓴다(게스트·카공지도면 마스킹).
  const name = member.user.name;
  return (
    <Flex direction="column" align="center" minW={0}>
      <Box pos="relative">
        <Avatar user={member.user} size="xs1" isLink={false} />
        {member.isApplying && (
          <Box
            pos="absolute"
            right="-3px"
            bottom="-3px"
            bg="white"
            borderRadius="50%"
            lineHeight={0}
            p="1px"
          >
            <CheckCircleIcon color="mint" size="sm" isFill />
          </Box>
        )}
      </Box>
      <Box
        mt={1}
        maxW="100%"
        fontSize="11px"
        lineHeight="14px"
        color="gray.700"
        textAlign="center"
        isTruncated
      >
        {isMasked ? maskUserName(name) : name}
      </Box>
    </Flex>
  );
}

function MoreTile({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <Flex as="button" type="button" direction="column" align="center" onClick={onClick}>
      <Flex
        w="32px"
        h="32px"
        align="center"
        justify="center"
        borderRadius="50%"
        bg="gray.100"
        fontSize="11px"
        fontWeight={600}
        color="gray.600"
      >
        +{count}
      </Flex>
    </Flex>
  );
}

export default StudyRegionMembers;
