import styled from "styled-components";

import OutlineBadge from "../../atoms/badges/OutlineBadge";
interface IAttendanceBadge {
  type: "attend" | "dismissed";
  time?: string;
}

export default function AttendanceBadge({ type, time }: IAttendanceBadge) {
  return (
    <BadgeContainer time={time}>
      <OutlineBadge
        text={type === "attend" ? "출석" : "불참"}
        colorScheme={type === "attend" ? "mintTheme" : "redTheme"}
      />

      {time && <TimeText>{time}</TimeText>}
    </BadgeContainer>
  );
}

const BadgeContainer = styled.div<{ time?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${({ time }) => (time ? "8px" : "0")};
`;

const TimeText = styled.span`
  font-size: 10px; /* Equivalent to text-xxs */
  color: var(--gray-3); /* Assuming text-gray-4 maps to this color */
`;
