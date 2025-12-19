import { Box, Text } from "@chakra-ui/react";

type MiniSemiGaugeNeedleProps = {
  value: number;
  min?: number;
  max?: number;
  size?: number; // default 60
  label?: string;
  formatValue?: (v: number) => string;
  formatMinMax?: (v: number) => string;
};

const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = (Math.PI / 180) * angleDeg;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const arcPath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const delta = endAngle - startAngle;
  const largeArcFlag = Math.abs(delta) <= 180 ? "0" : "1";
  const sweepFlag = delta >= 0 ? "1" : "0";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
};

export default function MiniSemiGaugeNeedle({
  value,
  min = 0,
  max = 100,
  size = 60,
  label,
}: MiniSemiGaugeNeedleProps) {
  const v = clamp(value, min, max);

  // --- geometry (size 60 기준) ---
  const w = size;
  const strokeWidth = 6;
  const padding = 6;

  const r = w / 2 - padding;

  // ✅ 아래 2줄 텍스트 공간 확보
  const h = r + padding + 34;

  const cx = w / 2;
  const cy = r + padding;

  // ✅ 위쪽 반원 ∩ : 180 -> 360
  const startAngle = 180;
  const endAngle = 360;

  // ✅ needle 각도는 value에 따라 회전
  const t = (v - min) / (max - min || 1); // 0..1
  const needleAngle = startAngle + (endAngle - startAngle) * t; // 180..360

  // ✅ 게이지는 항상 3구간 "꽉 참"
  const segments = [
    { from: 180, to: 240, color: "#F2994A" },
    { from: 240, to: 300, color: "#F2C94C" },
    { from: 300, to: 360, color: "#27AE60" },
  ];

  // --- needle ---
  const needleLen = r * 0.78;
  const needleWidth = 3;

  const tip = polarToCartesian(cx, cy, needleLen, needleAngle);
  const left = polarToCartesian(cx, cy, needleWidth, needleAngle - 90);
  const right = polarToCartesian(cx, cy, needleWidth, needleAngle + 90);
  const needlePath = `M ${left.x} ${left.y} L ${tip.x} ${tip.y} L ${right.x} ${right.y} Z`;

  // --- bottom text layout (요청한 고정 배치) ---
  const rowY = cy + 18; // min / value / max 줄
  const labelY = rowY + 16; // label 줄

  const minX = polarToCartesian(cx, cy, r + strokeWidth * 0.9, 180).x;
  const maxX = polarToCartesian(cx, cy, r + strokeWidth * 0.9, 360).x;

  const getGradeText = (value: number) => {
    if (value === 100) return "상";
    else if (value === 75) return "중상";
    else if (value === 50) return "중";
    else if (value === 25) return "중하";
    else return "하";
  };

  return (
    <Box position="relative" w={`${w}px`} h={`${h}px`} userSelect="none">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* ✅ 3구간 아크(항상 꽉 참) */}
        {segments.map((s, i) => (
          <path
            key={i}
            d={arcPath(cx, cy, r, s.from, s.to)}
            fill="none"
            stroke={s.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}

        {/* ✅ needle (value가 가리키는 위치) */}
        <path d={needlePath} fill="#D1D1D1" opacity={0.95} />
        <circle cx={cx} cy={cy} r={4} fill="#E5E5E5" />
        <circle cx={cx} cy={cy} r={2} fill="#BDBDBD" />
      </svg>

      {/* ✅ 1줄: min / 내 값 / max (같은 y) */}
      <Text
        position="absolute"
        left={`${minX}px`}
        top={`${rowY - 2}px`}
        transform="translate(-15%, -50%)"
        fontSize="9px"
        color="gray.400"
        fontWeight="600"
        lineHeight="1"
        whiteSpace="nowrap"
      >
        하
      </Text>

      <Text
        position="absolute"
        left={`${cx}px`}
        top={`${rowY}px`}
        transform="translate(-50%, -50%)"
        fontSize="10px"
        fontWeight="800"
        lineHeight="1"
        whiteSpace="nowrap"
      >
        {getGradeText(v)}
      </Text>

      <Text
        position="absolute"
        left={`${maxX}px`}
        top={`${rowY - 2}px`}
        transform="translate(-85%, -50%)"
        fontSize="9px"
        color="gray.400"
        fontWeight="600"
        lineHeight="1"
        whiteSpace="nowrap"
      >
        상
      </Text>

      {/* ✅ 2줄: label (가운데) */}
      {label && (
        <Text
          position="absolute"
          left={`${cx}px`}
          top={`${labelY}px`}
          transform="translate(-50%, -50%)"
          fontSize="8px"
          color="gray.500"
          lineHeight="1"
          whiteSpace="nowrap"
        >
          <b style={{ color: "var(--gray-600)" }}>{label}</b>명의 후기 반영
        </Text>
      )}
    </Box>
  );
}
