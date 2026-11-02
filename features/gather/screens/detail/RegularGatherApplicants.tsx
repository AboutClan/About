import { Box, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo } from "react";

import Avatar from "@/components/atoms/Avatar";
import ParticipationBar from "@/components/atoms/bars/ParticipationBar";
import { SECRET_USER_SUMMARY } from "@/constants/serviceConstants/userConstants";
import GatherOfficialParticipationChart from "@/features/gather/screens/detail/GatherOfficialParticipationChart";
import {
  buildRegularApplicants,
  getWeekdayLabel,
  RegularApplicant,
} from "@/features/gather/utils/regularGather";
import { IGather, IGatherParticipants } from "@/types/models/gatherTypes/gatherTypes";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";

interface RegularGatherApplicantsProps {
  data: IGather;
}

/**
 * 상시 행사 상세: 이번 주 신청자를 익명 카드로 보여 준다.
 * 카드마다 성별·나이, 고른 일정 / 콘텐츠, 신청 시각을 표시하고 아래에 나이·성비 통계를 붙인다.
 */
function RegularGatherApplicants({ data }: RegularGatherApplicantsProps) {
  const applicants = useMemo(() => buildRegularApplicants(data), [data]);

  const slotLabel = (key: string) => {
    const slot = data.slots?.find((s) => s.key === key);
    if (!slot) return null;
    return slot.date
      ? `${dayjs(slot.date).locale("ko").format("M.D(ddd)")} ${slot.time}`
      : `${getWeekdayLabel(slot.weekday)} ${slot.time}`;
  };
  const contentLabel = (key: string) => data.contents?.find((c) => c.key === key)?.title ?? null;

  /** "금 19:00, 토 13:00 / D'FESTA THE ORIGIN" (콘텐츠 전용 일정은 날짜만 적고 콘텐츠명은 뒤에) */
  const getChoiceText = (applicant: RegularApplicant) => {
    const slotOrder = (data.slots ?? []).map((s) => s.key);
    const contentOrder = (data.contents ?? []).map((c) => c.key);
    const slots = applicant.keys
      .filter((key) => slotOrder.includes(key))
      .sort((a, b) => slotOrder.indexOf(a) - slotOrder.indexOf(b))
      .map(slotLabel);
    const contents = applicant.keys
      .filter((key) => contentOrder.includes(key))
      .sort((a, b) => contentOrder.indexOf(a) - contentOrder.indexOf(b))
      .map(contentLabel);
    return [slots.join(", "), contents.join(", ")].filter(Boolean).join(" / ");
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
          label="이번 주 신청 인원"
          participantsCnt={applicants.length}
          maxCnt={data.memberCnt?.max}
        />
        {!applicants.length ? (
          <Text py={4} fontSize="13px" color="gray.500">
            아직 이번 주 신청자가 없어요.
          </Text>
        ) : (
          applicants.map((applicant) => (
            <Flex key={applicant.id} py={2.5} align="center" borderBottom="var(--border)">
              <Avatar
                user={SECRET_USER_SUMMARY as unknown as UserSimpleInfoProps}
                size="md1"
                isLink={false}
              />
              <Flex direction="column" flex={1} ml={3} minW={0}>
                <Flex align="baseline">
                  <Box fontSize="13px" fontWeight="semibold" lineHeight="20px">
                    익명
                  </Box>
                  {(applicant.gender || applicant.age) && (
                    <Box ml={1} fontSize="11px" color="gray.500">
                      {[applicant.gender, applicant.age ? `${applicant.age}세` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </Box>
                  )}
                </Flex>
                <Text fontSize="12px" color="gray.600" noOfLines={1}>
                  {getChoiceText(applicant) || "선택 정보 없음"}
                </Text>
              </Flex>
              {applicant.submittedAt && (
                <Box ml={2} flexShrink={0} fontSize="11px" color="gray.500">
                  {dayjs(applicant.submittedAt).format("M.D HH:mm")}
                </Box>
              )}
            </Flex>
          ))
        )}
      </Flex>
      <GatherOfficialParticipationChart
        data={chartData}
        applicantLabel={{ text: "이번 주 신청 인원", count: applicants.length }}
      />
    </>
  );
}

export default RegularGatherApplicants;
