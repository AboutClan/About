import { Badge, Box, Button, Checkbox, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

import { useGatherInviteMutation } from "@/features/gather/hooks/mutations";
import { useGatherIDQuery } from "@/features/gather/hooks/queries";
import { useResetGatherQuery } from "@/features/gather/hooks/useResetGatherQuery";
import { withRealName } from "@/features/gather/utils/memberDisplay";
import { formatSlot } from "@/features/gather/utils/regularGather";
import { useToast } from "@/hooks/custom/CustomToast";
import { IGather } from "@/types/models/gatherTypes/gatherTypes";

interface ParentApplicantInviteBoardProps {
  /** 상시 행사에서 만든 확정 모임 */
  gather: IGather;
}

/**
 * 확정 모임 관리 화면의 "상시 행사 신청자" 탭.
 * 상위 상시 행사(parentGatherId)의 구글폼 신청자 중 회원과 연결된 사람을 보여 주고, 체크해 초대 참여자로 넣는다.
 * 이 확정 모임과 같은 회차(날짜·요일+시간)를 고른 신청자를 위에 둔다. 이미 참여자인 회원은 뺀다.
 */
function ParentApplicantInviteBoard({ gather }: ParentApplicantInviteBoardProps) {
  const toast = useToast();
  const resetQuery = useResetGatherQuery();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isInviting, setIsInviting] = useState(false);

  const { data: parent } = useGatherIDQuery(gather.parentGatherId, {
    enabled: !!gather.parentGatherId,
  });
  const { mutateAsync: invite } = useGatherInviteMutation(gather.id);

  // 이 확정 모임 일시와 맞는 상위 행사 일정 key
  const matchingKeys = useMemo(() => {
    const when = dayjs(gather.date);
    return new Set(
      (parent?.slots ?? [])
        .filter((slot) =>
          slot.date
            ? slot.date === when.format("YYYY-MM-DD")
            : slot.weekday === when.day() && slot.time === when.format("HH:mm"),
        )
        .map((slot) => slot.key),
    );
  }, [parent?.slots, gather.date]);

  const participantIds = new Set(
    gather.participants.map((p) => p.user?._id).filter((id): id is string => !!id),
  );

  const candidates = useMemo(
    () =>
      (parent?.formStats?.applicants ?? [])
        .filter((a) => a.user && !participantIds.has(a.user._id))
        .map((a) => ({ ...a, isMatch: a.keys?.some((key) => matchingKeys.has(key)) }))
        .sort((a, b) => Number(b.isMatch) - Number(a.isMatch)),
    [parent?.formStats, matchingKeys, gather.participants],
  );

  const slotLabel = (key: string) => {
    const slot = parent?.slots?.find((s) => s.key === key);
    if (slot) return formatSlot(slot);
    return parent?.contents?.find((c) => c.key === key)?.title ?? null;
  };

  const toggle = (userId: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });

  const handleInvite = async () => {
    const ids = Array.from(selected);
    const max = gather.memberCnt?.max ?? 0;
    if (max && participantIds.size + ids.length > max) {
      toast("warning", `최대 인원(${max}명)을 넘어요. 현재 ${participantIds.size}명이에요.`);
      return;
    }
    setIsInviting(true);
    let done = 0;
    for (const userId of ids) {
      try {
        await invite({ phase: "first", userId });
        done++;
      } catch {
        // 한 명 실패해도 나머지는 계속 넣는다
      }
    }
    setIsInviting(false);
    setSelected(new Set());
    resetQuery();
    toast(
      done === ids.length ? "success" : "warning",
      `${done}명을 초대했어요.${done < ids.length ? ` (${ids.length - done}명 실패)` : ""}`,
    );
  };

  if (!gather.parentGatherId) return null;
  if (!parent) return null;

  return (
    <Box px={5} pb={10}>
      <Text fontSize="13px" color="gray.600" mb={3}>
        {parent.title} 신청자 중 회원과 연결된 사람이에요. 이 모임과 같은 회차를 고른 사람이 위에
        있어요.
      </Text>
      {!candidates.length ? (
        <Text fontSize="13px" color="gray.500">
          초대할 수 있는 신청자가 없어요.
        </Text>
      ) : (
        <Flex flexDir="column" border="var(--border)" borderRadius="8px">
          {candidates.map((a, idx) => (
            <Checkbox
              key={a.user._id}
              px={3}
              py={2.5}
              borderTop={idx ? "var(--border)" : "none"}
              isChecked={selected.has(a.user._id)}
              onChange={() => toggle(a.user._id)}
            >
              <Box>
                <Text fontSize="13px">
                  {withRealName(a.user.nickname || "닉네임 없음", a.user.name)}
                  <Box as="span" ml={1} fontSize="11px" color="gray.500">
                    {[a.gender, a.birthYear ? `${dayjs().year() - a.birthYear}세` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </Box>
                  {a.isMatch && (
                    <Badge ml={1} colorScheme="mint" variant="subtle" fontSize="9px">
                      이 회차 신청
                    </Badge>
                  )}
                </Text>
                <Text fontSize="11px" color="gray.500">
                  {(a.keys ?? []).map(slotLabel).filter(Boolean).join(", ") || "선택 정보 없음"}
                </Text>
              </Box>
            </Checkbox>
          ))}
        </Flex>
      )}
      <Button
        mt={4}
        w="full"
        colorScheme="black"
        isLoading={isInviting}
        isDisabled={!selected.size}
        onClick={handleInvite}
      >
        {selected.size ? `${selected.size}명 초대하기` : "초대할 회원을 선택하세요"}
      </Button>
    </Box>
  );
}

export default ParentApplicantInviteBoard;
