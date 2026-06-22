import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import Avatar from "../../components/atoms/Avatar";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useGroupMyStatusQuery } from "../../hooks/groupStudy/queries";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { birthToAge } from "../../utils/convertUtils/convertTypes";

const ROLE_KR: Record<string, string> = {
  member: "정회원",
  manager: "운영진",
  previliged: "관리자",
  resting: "휴식 중",
  human: "준회원",
  enthusiastic: "열정 멤버",
  support: "서포터",
  newUser: "신규 가입",
  waiting: "대기 중",
};

export default function MemberCardPage() {
  const { data: userInfo } = useUserInfoQuery();
  const { data: myGroups } = useGroupMyStatusQuery(0, "isParticipating", {
    enabled: !!userInfo,
  });

  if (!userInfo) return null;

  const isActive = userInfo.isActive;
  const roleKr = ROLE_KR[userInfo.role] ?? userInfo.role;
  const registerDate = userInfo.registerDate
    ? dayjs(userInfo.registerDate).format("YYYY년 MM월 DD일")
    : "-";

  return (
    <>
      <Header title="멤버 확인증" url="/user/setting" />
      <Slide>
        <Flex direction="column" align="center" pt={6} pb={10} mt={10}>
          {/* 카드 */}
          <Box
            w="full"
            maxW="360px"
            bg="white"
            borderRadius="20px"
            boxShadow="0 4px 24px rgba(0,0,0,0.10)"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.100"
          >
            {/* 카드 상단 민트 헤더 */}
            <Box bg="var(--color-mint)" px={6} pt={5} pb={8} position="relative">
              <Box
                fontSize="11px"
                fontWeight={700}
                color="rgba(255,255,255,0.7)"
                letterSpacing="0.08em"
                mb={1}
              >
                ABOUT COMMUNITY
              </Box>
              <Box fontSize="18px" fontWeight={800} color="white">
                멤버 확인증
              </Box>

              {/* 활동 상태 뱃지 */}
              <Flex
                position="absolute"
                top={5}
                right={5}
                px={3}
                py={1}
                borderRadius="20px"
                bg={isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"}
                align="center"
                gap={1}
              >
                <Box
                  w="6px"
                  h="6px"
                  borderRadius="50%"
                  bg={isActive ? "white" : "rgba(255,255,255,0.4)"}
                />
                <Box fontSize="11px" fontWeight={700} color="white">
                  {isActive ? "현 어바웃 활동 멤버" : "어바웃 멤버 아님"}
                </Box>
              </Flex>
            </Box>

            {/* 아바타 (헤더와 겹침) */}
            <Box px={6} mt="-28px" mb={2}>
              <Box>
                <Avatar user={{ profileImage: userInfo?.profileImage }} size="lg1" />
              </Box>
            </Box>

            {/* 이름 + 코멘트 */}
            <Box px={6} mb={4}>
              <Box fontSize="18px" fontWeight={800} color="gray.900" lineHeight="26px">
                {userInfo.name}
              </Box>
              <Box fontSize="12px" color="gray.500" mt={0.5}>
                {userInfo.comment || "소개글 없음"}
              </Box>
            </Box>

            {/* 구분선 */}
            <Box mx={6} h="1px" bg="gray.100" mb={4} />

            {/* 정보 항목 */}
            <Flex direction="column" px={6} gap={3} mb={5}>
              <InfoRow label="역할" value={roleKr} />
              <InfoRow label="가입일" value={registerDate} />
              <InfoRow label="성별" value={userInfo.gender ?? "-"} />
              <InfoRow
                label="나이"
                value={userInfo.birth ? `만 ${birthToAge(userInfo.birth)}세` : "-"}
              />
              <InfoRow
                label="활동 상태"
                value={isActive ? "✅ 활동 중" : "❌ 비활동"}
                valueColor={isActive ? "var(--color-mint)" : "var(--color-red)"}
              />
            </Flex>

            {/* 소모임 */}
            {myGroups && myGroups.length > 0 && (
              <>
                <Box mx={6} h="1px" bg="gray.100" mb={4} />
                <Box px={6} mb={5}>
                  <Box fontSize="12px" fontWeight={700} color="gray.500" mb={2}>
                    가입 소모임
                  </Box>
                  <Flex direction="column" gap={2}>
                    {myGroups.slice(0, 3).map((group) => (
                      <Flex key={group.id} align="center" gap={2}>
                        <Box
                          w="6px"
                          h="6px"
                          borderRadius="50%"
                          bg="var(--color-mint)"
                          flexShrink={0}
                        />
                        <Box fontSize="13px" color="gray.700" fontWeight={500}>
                          {group.title}
                        </Box>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              </>
            )}

            {/* 카드 하단 */}
            <Box bg="gray.50" px={6} py={3} borderTop="1px solid" borderColor="gray.100">
              <Box fontSize="10px" color="gray.400" textAlign="center">
                본 확인증은 어바웃 커뮤니티 소속 멤버를 확인하기 위한 문서입니다.
              </Box>
            </Box>
          </Box>
        </Flex>
      </Slide>
    </>
  );
}

function InfoRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Flex justify="space-between" align="center">
      <Box fontSize="12px" color="gray.500" fontWeight={500}>
        {label}
      </Box>
      <Box fontSize="13px" fontWeight={600} color={valueColor ?? "gray.800"}>
        {value}
      </Box>
    </Flex>
  );
}
