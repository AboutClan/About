import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo } from "react";

import Avatar from "@/components/atoms/Avatar";
import ParticipationBar from "@/components/atoms/bars/ParticipationBar";
import { CheckCircleIcon } from "@/components/Icons/CircleIcons";
import GatherOfficialParticipationChart from "@/features/gather/screens/detail/GatherOfficialParticipationChart";
import {
  canSeeRealName,
  getFallbackAvatar,
  getFallbackNickname,
  withRealName,
} from "@/features/gather/utils/memberDisplay";
import {
  buildRegularApplicants,
  getWeekdayLabel,
  RegularApplicant,
} from "@/features/gather/utils/regularGather";
import { useDefaultNicknamesQuery } from "@/features/user/hooks/queries";
import { useToast } from "@/hooks/custom/CustomToast";
import { useUserInfo } from "@/hooks/custom/UserHooks";
import { IGather, IGatherParticipants } from "@/types/models/gatherTypes/gatherTypes";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";

interface RegularGatherApplicantsProps {
  data: IGather;
}

/**
 * 상시 행사 상세: 신청자(아직 지나지 않은 날짜를 고른 구글폼 응답 + 가짜 인원)를 카드로 보여 준다.
 * 앱에서 신청해 회원과 연결된 응답은 그 회원의 아바타·닉네임을,
 * 외부 신청자는 신청자별로 고정된 기본 닉네임·아바타를 쓴다.
 * 카드마다 성별·나이, 고른 일정 / 콘텐츠, 신청 시각을 표시하고 아래에 나이·성비 통계를 붙인다.
 */
function RegularGatherApplicants({ data }: RegularGatherApplicantsProps) {
  const { data: nicknamePool } = useDefaultNicknamesQuery();
  const toast = useToast();
  const userInfo = useUserInfo();
  // 운영진·모임장은 회원과 연결된 신청자를 "닉네임 (실명)"으로 본다
  const showRealName = canSeeRealName(userInfo, data.user as UserSimpleInfoProps);
  const applicants = useMemo(() => buildRegularApplicants(data), [data]);

  const slotLabel = (key: string) => {
    const slot = data.slots?.find((s) => s.key === key);
    if (!slot) return null;
    return slot.date
      ? `${dayjs(slot.date).locale("ko").format("M.D(ddd)")} ${slot.time}`
      : `${getWeekdayLabel(slot.weekday)} ${slot.time}`;
  };
  const contentLabel = (key: string) => data.contents?.find((c) => c.key === key)?.title ?? null;

  /** 고른 일정·콘텐츠 이름 (행사에 등록된 순서대로) */
  const getChoices = (applicant: RegularApplicant) => {
    const slotOrder = (data.slots ?? []).map((s) => s.key);
    const contentOrder = (data.contents ?? []).map((c) => c.key);
    const pick = (order: string[], label: (key: string) => string | null) =>
      applicant.keys
        .filter((key) => order.includes(key))
        .sort((a, b) => order.indexOf(a) - order.indexOf(b))
        .map((key) => ({ key, text: label(key) }))
        .filter((item): item is { key: string; text: string } => !!item.text);
    return { slots: pick(slotOrder, slotLabel), contents: pick(contentOrder, contentLabel) };
  };

  // 통계 차트는 participants의 더미 성별·생년(YYMMDD)으로 계산하므로 그 모양으로 바꿔 넘긴다.
  const chartData: IGather = useMemo(() => {
    const currentYear = dayjs().year();
    const participants: IGatherParticipants[] = applicants.map((applicant) => ({
      isDummy: true,
      dummyGender: applicant.gender ?? undefined,
      dummyBirth: applicant.age
        ? `${String((currentYear - applicant.age) % 100).padStart(2, "0")}0101`
        : undefined,
    }));
    return { ...data, participants, waiting: [] };
  }, [applicants, data]);

  return (
    <>
      <Flex flexDir="column" px={5}>
        <ParticipationBar
          type="pending"
          label="신청 인원"
          participantsCnt={applicants.length}
          maxCnt={data.memberCnt?.max}
        />
        {!applicants.length ? (
          <Text py={4} fontSize="13px" color="gray.500">
            아직 신청자가 없어요.
          </Text>
        ) : (
          applicants.map((applicant) => {
            const { slots, contents } = getChoices(applicant);
            const isNew =
              !!applicant.submittedAt && dayjs().diff(dayjs(applicant.submittedAt), "hour") < 24;
            return (
              <Flex key={applicant.id} py={2.5} align="center" borderBottom="var(--border)">
                {applicant.user ? (
                  // 회원과 연결된 신청자는 아바타 오른쪽 아래에 인증 체크
                  <Box position="relative" flexShrink={0}>
                    <Avatar user={applicant.user as unknown as UserSimpleInfoProps} size="md1" />
                    <Flex
                      position="absolute"
                      right="-2px"
                      bottom="-2px"
                      bg="white"
                      borderRadius="full"
                      p="1px"
                      pointerEvents="none"
                    >
                      <CheckCircleIcon size="sm" color="mint" isFill />
                    </Flex>
                  </Box>
                ) : (
                  // 회원과 연결되지 않은 신청자(외부 신청자·성비 보정 인원)는 볼 프로필이 없다
                  <Box
                    cursor="pointer"
                    onClick={() =>
                      toast("info", "어바웃 외부 멤버라 프로필 정보를 확인할 수 없어요.")
                    }
                  >
                    <Avatar
                      user={
                        {
                          _id: "",
                          avatar: getFallbackAvatar(`${data.id}-${applicant.id}`),
                        } as unknown as UserSimpleInfoProps
                      }
                      size="md1"
                      isLink={false}
                    />
                  </Box>
                )}
                <Flex direction="column" flex={1} ml={3} minW={0}>
                  <Flex align="baseline">
                    <Box fontSize="13px" fontWeight="semibold" lineHeight="20px">
                      {withRealName(
                        applicant.user?.nickname ||
                          getFallbackNickname(`${data.id}-${applicant.id}`, nicknamePool),
                        showRealName ? applicant.user?.name : null,
                      )}
                    </Box>
                    {(applicant.gender || applicant.age) && (
                      <Box ml={1} fontSize="11px" color="gray.500">
                        {[applicant.gender, applicant.age ? `${applicant.age}세` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </Box>
                    )}
                  </Flex>
                  {slots.length || contents.length ? (
                    <Flex mt={1} gap={1} wrap="wrap">
                      {slots.map((slot) => (
                        <Badge
                          key={slot.key}
                          variant="outline"
                          colorScheme="mint"
                          fontSize="10px"
                          fontWeight={500}
                          borderRadius="4px"
                          px={1.5}
                        >
                          {slot.text}
                        </Badge>
                      ))}
                      {contents.map((content) => (
                        <Badge
                          key={content.key}
                          variant="subtle"
                          colorScheme="gray"
                          color="var(--gray-600)"
                          fontSize="10px"
                          fontWeight={500}
                          borderRadius="4px"
                          px={1.5}
                          maxW="160px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {content.text}
                        </Badge>
                      ))}
                    </Flex>
                  ) : (
                    <Text fontSize="12px" color="gray.500">
                      선택 정보 없음
                    </Text>
                  )}
                </Flex>
                {applicant.submittedAt && (
                  <Flex ml={2} flexShrink={0} align="center" fontSize="11px" color="gray.500">
                    {isNew && (
                      <Box as="span" mr={1} fontSize="9px" fontWeight={700} color="mint">
                        NEW
                      </Box>
                    )}
                    {formatRelative(applicant.submittedAt)}
                  </Flex>
                )}
              </Flex>
            );
          })
        )}
      </Flex>
      <GatherOfficialParticipationChart
        data={chartData}
        applicantLabel={{ text: "신청 인원", count: applicants.length }}
      />
    </>
  );
}

/** "방금 전 신청" / "15분 전 신청" / "3시간 전 신청" / 하루가 지나면 "11월 1일 신청" */
function formatRelative(time: string) {
  const minutes = dayjs().diff(dayjs(time), "minute");
  if (minutes < 1) return "방금 전 신청";
  if (minutes < 60) return `${minutes}분 전 신청`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}시간 전 신청`;
  return `${dayjs(time).format("M월 D일")} 신청`;
}

export default RegularGatherApplicants;
