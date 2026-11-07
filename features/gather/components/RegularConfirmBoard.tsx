import { Box, Button, Checkbox, Flex, Input, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { useRegularConfirmMutation } from "@/features/gather/hooks/mutations";
import { withRealName } from "@/features/gather/utils/memberDisplay";
import { formatSlot, getVisibleSlots } from "@/features/gather/utils/regularGather";
import { useToast } from "@/hooks/custom/CustomToast";
import { IGather } from "@/types/models/gatherTypes/gatherTypes";

interface RegularConfirmBoardProps {
  gather: IGather;
}

/** 확정 모임을 만들 기준: 일정(slot)이 있으면 일정, 없으면(예: 독서 모임) 콘텐츠 */
interface ConfirmOption {
  key: string;
  label: string;
  /** 날짜가 정해진 일정이면 고정 */
  fixedDate?: string;
  /** 매주 일정이면 요일 */
  weekday?: number;
  time?: string;
  contentTitle?: string;
}

/** 오늘 이후 가장 가까운 그 요일 */
const nextWeekday = (weekday: number) => {
  const today = dayjs().startOf("day");
  return today.add((weekday - today.day() + 7) % 7, "day");
};

/**
 * 상시 행사 관리 화면의 "확정 모임" 탭.
 * 회차(또는 콘텐츠)와 날짜를 고르면 그 회차를 고른 신청자 중 회원과 연결된 사람을 보여 주고,
 * 체크한 회원을 초대 참여자로 넣은 확정 모임(별도 번개, 상시 행사와 연결)을 만든다.
 * 회원과 연결되지 않은 외부 신청자는 초대할 계정이 없어 따로 연락해야 한다.
 */
function RegularConfirmBoard({ gather }: RegularConfirmBoardProps) {
  const router = useRouter();
  const toast = useToast();

  const options: ConfirmOption[] = useMemo(() => {
    const slots = getVisibleSlots(gather.slots, false);
    if (slots.length) {
      return slots.map((slot) => ({
        key: slot.key,
        label: formatSlot(slot),
        fixedDate: slot.date,
        weekday: slot.date ? undefined : slot.weekday,
        time: slot.time,
        contentTitle: gather.contents?.find((c) => c.key === slot.contentKey)?.title,
      }));
    }
    return (gather.contents ?? []).map((content) => ({
      key: content.key,
      label: content.title,
      contentTitle: content.title,
    }));
  }, [gather.slots, gather.contents]);

  const [optionKey, setOptionKey] = useState<string>("");
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("19:00");
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const option = options.find((o) => o.key === optionKey);

  // 회차를 고르면 날짜·시간·제목 기본값을 채운다
  useEffect(() => {
    if (!option) return;
    const date = option.fixedDate
      ? dayjs(option.fixedDate)
      : option.weekday !== undefined
        ? nextWeekday(option.weekday)
        : dayjs().add(7, "day");
    setDateStr(date.format("YYYY-MM-DD"));
    if (option.time) setTimeStr(option.time);
    setSelected(new Set());
  }, [optionKey]);

  useEffect(() => {
    if (!option || !dateStr) return;
    const when = dayjs(`${dateStr} ${timeStr}`).locale("ko").format("M.D(ddd) HH:mm");
    setTitle(`${option.contentTitle ?? gather.title} · ${when}`);
  }, [optionKey, dateStr, timeStr]);

  const applicants = useMemo(
    () => (gather.formStats?.applicants ?? []).filter((a) => a.keys?.includes(optionKey)),
    [gather.formStats, optionKey],
  );
  const members = applicants.filter((a) => a.user);
  const externalCount = applicants.length - members.length;

  const { mutate, isLoading } = useRegularConfirmMutation(gather.id, {
    onSuccess({ gatherId }) {
      toast("success", "확정 모임을 만들었어요.");
      router.push(`/gather/${gatherId}`);
    },
    onError() {
      toast("error", "확정 모임을 만들지 못했어요.");
    },
  });

  const toggle = (userId: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });

  const handleCreate = () => {
    if (!option || !dateStr || !title.trim()) {
      toast("warning", "회차·날짜·제목을 확인해 주세요.");
      return;
    }
    mutate({
      optionKey: option.key,
      date: dayjs(`${dateStr} ${timeStr}`).toISOString(),
      title: title.trim(),
      userIds: Array.from(selected),
    });
  };

  if (!options.length) {
    return (
      <Text px={5} fontSize="13px" color="gray.500">
        등록된 회차·콘텐츠가 없어요.
      </Text>
    );
  }

  return (
    <Box px={5} pb={10}>
      <Text fontSize="14px" fontWeight={600} mb={2}>
        1. 회차 선택
      </Text>
      <Flex gap={2} wrap="wrap" mb={5}>
        {options.map((o) => (
          <Button
            key={o.key}
            size="sm"
            variant={o.key === optionKey ? "solid" : "outline"}
            colorScheme={o.key === optionKey ? "mint" : "gray"}
            onClick={() => setOptionKey(o.key)}
          >
            {o.label}
          </Button>
        ))}
      </Flex>

      {option && (
        <>
          <Text fontSize="14px" fontWeight={600} mb={2}>
            2. 일시·제목
          </Text>
          <Flex gap={2} mb={2}>
            <Input
              type="date"
              size="sm"
              value={dateStr}
              isDisabled={!!option.fixedDate}
              onChange={(e) => setDateStr(e.target.value)}
            />
            <Input
              type="time"
              size="sm"
              value={timeStr}
              isDisabled={!!option.time}
              onChange={(e) => setTimeStr(e.target.value)}
            />
          </Flex>
          <Input size="sm" mb={5} value={title} onChange={(e) => setTitle(e.target.value)} />

          <Flex justify="space-between" align="baseline" mb={2}>
            <Text fontSize="14px" fontWeight={600}>
              3. 초대할 회원 ({selected.size}/{members.length})
            </Text>
            {members.length > 0 && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() =>
                  setSelected(
                    selected.size === members.length
                      ? new Set()
                      : new Set(members.map((a) => a.user._id)),
                  )
                }
              >
                {selected.size === members.length ? "전체 해제" : "전체 선택"}
              </Button>
            )}
          </Flex>
          {!members.length ? (
            <Text fontSize="13px" color="gray.500" mb={2}>
              이 회차를 고른 회원 신청자가 없어요.
            </Text>
          ) : (
            <Flex flexDir="column" border="var(--border)" borderRadius="8px" mb={2}>
              {members.map((a, idx) => (
                <Checkbox
                  key={a.user._id}
                  px={3}
                  py={2.5}
                  borderTop={idx ? "var(--border)" : "none"}
                  isChecked={selected.has(a.user._id)}
                  onChange={() => toggle(a.user._id)}
                >
                  <Text fontSize="13px">
                    {withRealName(a.user.nickname || "닉네임 없음", a.user.name)}
                    <Box as="span" ml={1} fontSize="11px" color="gray.500">
                      {[a.gender, a.birthYear ? `${dayjs().year() - a.birthYear}세` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </Box>
                  </Text>
                </Checkbox>
              ))}
            </Flex>
          )}
          {externalCount > 0 && (
            <Text fontSize="12px" color="gray.500" mb={2}>
              회원과 연결되지 않은 외부 신청자 {externalCount}명은 초대할 수 없어 따로 연락해
              주세요.
            </Text>
          )}

          <Button mt={4} w="full" colorScheme="black" isLoading={isLoading} onClick={handleCreate}>
            확정 모임 만들기{selected.size ? ` (${selected.size}명 초대)` : ""}
          </Button>
        </>
      )}
    </Box>
  );
}

export default RegularConfirmBoard;
