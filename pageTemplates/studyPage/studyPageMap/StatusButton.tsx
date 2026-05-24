import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";

import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import { useOverlayRouter } from "../../../hooks/useOverlayRouter";

type CafeStatus = "great" | "good" | "bad";

function getCafeStatus(): CafeStatus {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isWeekend = day === 0 || day === 6;

  if (isWeekend) {
    if (hour >= 11 && hour < 13) return "good";
    if (hour >= 13 && hour < 17) return "bad";
    if (hour >= 17 && hour < 18) return "good";
  } else {
    if (hour >= 12 && hour < 14) return "good";
    if (hour >= 14 && hour < 17) return "bad";
    if (hour >= 17 && hour < 18) return "good";
  }
  return "great";
}

const STATUS_CONFIG: Record<
  CafeStatus,
  { label: string; image: string; barColor: string; desc: string; bg: string }
> = {
  great: {
    label: "여유",
    image: "/cafe/great.png",
    barColor: "var(--color-mint)",
    desc: "지금 카공하기 딱 좋아요!",
    bg: "rgba(0,194,179,0.08)",
  },
  good: {
    label: "보통",
    image: "/cafe/good.png",
    barColor: "var(--color-orange)",
    desc: "조금 붐비지만 자리가 있어요",
    bg: "rgba(255,165,1,0.08)",
  },
  bad: {
    label: "부족",
    image: "/cafe/bad.png",
    barColor: "var(--color-red)",
    desc: "지금은 카공 자리가 부족해요",
    bg: "rgba(255,105,105,0.08)",
  },
};

type TimeSlot = { time: string; status: CafeStatus; from: number; to: number };

// to > 24 이면 자정을 넘는 슬롯 (18~06시 → from=18, to=30)
function isCurrentSlot(slot: TimeSlot, hour: number): boolean {
  if (slot.to <= 24) return hour >= slot.from && hour < slot.to;
  // wrap-around: 18시~06시 → hour >= 18 OR hour < 6
  return hour >= slot.from || hour < slot.to - 24;
}

function getTimeSlots(isWeekend: boolean): TimeSlot[] {
  if (isWeekend) {
    return [
      { time: "06시~11시", status: "great", from: 6, to: 11 },
      { time: "11시~13시", status: "good", from: 11, to: 13 },
      { time: "13시~17시", status: "bad", from: 13, to: 17 },
      { time: "17시~18시", status: "good", from: 17, to: 18 },
      { time: "18시~06시", status: "great", from: 18, to: 30 },
    ];
  }
  return [
    { time: "06시~12시", status: "great", from: 6, to: 12 },
    { time: "12시~14시", status: "good", from: 12, to: 14 },
    { time: "14시~17시", status: "bad", from: 14, to: 17 },
    { time: "17시~18시", status: "good", from: 17, to: 18 },
    { time: "18시~06시", status: "great", from: 18, to: 30 },
  ];
}

function StatusButton() {
  const router = useRouter();
  const { updateQuery } = useOverlayRouter();

  const isSheetOpen = router.query.modal === "statusSheet";
  const status = getCafeStatus();
  const { label, image, barColor } = STATUS_CONFIG[status];

  return (
    <>
      <Flex
        as="button"
        w="40px"
        direction="column"
        align="center"
        bg="white"
        borderRadius="20px"
        py={1.5}
        boxShadow="0px 4px 12px rgba(0,0,0,0.12)"
        onClick={() => updateQuery({ modal: "statusSheet" })}
      >
        <Image src={image} alt="status" width={28} height={28} objectFit="contain" />
        <Text fontSize="12px" fontWeight={800} color="gray.900" mt={0.5}>
          {label}
        </Text>
        <Box mb={0.5} w="24px" h="3px" borderRadius="999px" bg={barColor} />
        <Text fontSize="10px" color="gray.500" fontWeight={600}>
          자리
        </Text>
      </Flex>

      {isSheetOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <BottomFlexDrawer
            isDrawerUp
            isOverlay
            isHideBottom
            hasTopNav={false}
            height={394}
            zIndex={5000}
            setIsModal={() => router.back()}
          >
            <BottomSheetContent onClose={() => router.back()} />
          </BottomFlexDrawer>,
          document.body,
        )}
    </>
  );
}

export default StatusButton;

function BottomSheetContent({ onClose }: { onClose: () => void }) {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isWeekend = day === 0 || day === 6;
  const dayLabel = isWeekend ? "주말" : "평일";

  const status = getCafeStatus();
  const { label, image, desc, bg } = STATUS_CONFIG[status];
  const slots = getTimeSlots(isWeekend);

  return (
    <Flex direction="column" w="full" h="full" overflowY="auto">
      {/* 헤더 */}
      <Flex justify="space-between" align="center" py={4}>
        <Text fontSize="18px" fontWeight={800}>
          카페에 자리가 있을까?
        </Text>
        <IconButton
          aria-label="close"
          icon={<CloseIcon boxSize={3} />}
          borderRadius="full"
          bg="none"
          minW="36px"
          h="36px"
          onClick={onClose}
        />
      </Flex>

      {/* 현재 상태 카드 */}
      <Flex align="center" bg={bg} borderRadius="16px" px={4} py={3} mb={3} gap={3}>
        <Image src={image} alt={label} width={50} height={50} objectFit="contain" />
        <Flex direction="column">
          <Flex align="center" mb={0.5}>
            <Text fontSize="18px" lineHeight="28px" fontWeight={800} color="gray.900">
              {label}
            </Text>
          </Flex>
          <Text fontSize="13px" color="gray.600" lineHeight="20px">
            {desc}
          </Text>
        </Flex>
      </Flex>

      {/* 시간대별 혼잡도 */}
      <Box bg="gray.50" borderRadius="16px" px={4} py={4}>
        <Text fontSize="13px" fontWeight={700} mb={4} color="gray.800">
          {dayLabel} 시간대별 혼잡도
        </Text>

        <Flex direction="column" gap={2}>
          {(() => {
            const currentIdx = slots.findIndex((s) => isCurrentSlot(s, hour));
            const n = slots.length;
            const visible = [-1, 0, 1].map((offset) => slots[(currentIdx + offset + n) % n]);
            return visible;
          })().map((slot) => {
            const cfg = STATUS_CONFIG[slot.status];
            const isCurrent = isCurrentSlot(slot, hour);
            return (
              <Flex key={slot.time} align="center" gap={3}>
                {/* 색상 바 */}
                <Box
                  w="4px"
                  h="36px"
                  borderRadius="999px"
                  bg={cfg.barColor}
                  flexShrink={0}
                  opacity={isCurrent ? 1 : 0.35}
                />
                {/* 시간 */}
                <Text
                  fontSize="13px"
                  color={isCurrent ? "gray.900" : "gray.400"}
                  fontWeight={isCurrent ? 700 : 400}
                  w="68px"
                  flexShrink={0}
                >
                  {slot.time}
                </Text>
                {/* 상태 라벨 */}
                <Flex
                  align="center"
                  justify="center"
                  px={3}
                  py={1}
                  borderRadius="999px"
                  bg={isCurrent ? cfg.barColor : "transparent"}
                >
                  <Text fontSize="12px" fontWeight={700} color={isCurrent ? "white" : cfg.barColor}>
                    {cfg.label}
                  </Text>
                </Flex>
                {isCurrent && (
                  <Text fontSize="11px" color="gray.400">
                    ← 지금
                  </Text>
                )}
              </Flex>
            );
          })}
        </Flex>
      </Box>

      <Text mt={4} mb={4} fontSize="11px" color="gray.400">
        ※ 실제 혼잡도는 카페별로 다를 수 있어요.
      </Text>
    </Flex>
  );
}
