import {
  faA as A,
  faB as B,
  faO as O,
  faT as T,
  faU as U,
} from "@fortawesome/pro-duotone-svg-icons";
import {
  faCircleA,
  faCircleB,
  faCircleO,
  faCircleT,
  faCircleU,
} from "@fortawesome/pro-regular-svg-icons";
import { faA, faB, faO, faT, faU } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

import { TABLE_STRING_COLORS_BG, TABLE_STRONG_COLORS } from "../../../constants/styles";
import { Alphabet } from "../../../types/models/collections";

interface IAlphabetIcon {
  alphabet: Alphabet;
  isDuotone?: boolean;
  isBeat?: boolean;
  isCircle?: boolean;
  isBg?: boolean;
  size?: "md";
}

export function AlphabetIcon({
  alphabet,
  isDuotone,
  isBeat,
  isCircle,
  size,
  isBg = false,
}: IAlphabetIcon) {
  const icons = {
    A: { duotone: A, solid: faA, circle: faCircleA },
    B: { duotone: B, solid: faB, circle: faCircleB },
    O: { duotone: O, solid: faO, circle: faCircleO },
    U: { duotone: U, solid: faU, circle: faCircleU },
    T: { duotone: T, solid: faT, circle: faCircleT },
  };
  const selectedIcon = isCircle
    ? icons[alphabet].circle
    : isDuotone
      ? icons[alphabet].duotone
      : icons[alphabet].solid;

  const colorIndex = ["A", "B", "O", "U", "T"].indexOf(alphabet);
  const color = TABLE_STRONG_COLORS[colorIndex];

  return (
    <IconWrapper size={size} bg={isBg ? TABLE_STRING_COLORS_BG[color] : null}>
      <FontAwesomeIcon
        icon={selectedIcon}
        size="2x"
        color={color}
        beat={isBeat}
        style={{ opacity: isDuotone ? 0.5 : 1 }}
      />
    </IconWrapper>
  );
}

const IconWrapper = styled.div<{ size: "md"; bg: string }>`
  width: ${(props) => (props.size === "md" ? "44px" : null)};
  background-color: ${(props) => props.bg};
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
`;
