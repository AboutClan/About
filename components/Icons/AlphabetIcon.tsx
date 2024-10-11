import styled from "styled-components";

import { TABLE_STRING_COLORS_BG, TABLE_STRONG_COLORS } from "../../constants/styles";
import { Alphabet } from "../../types/models/collections";

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
    A: { duotone: "a", solid: "a", circle: "circle-a" },
    B: { duotone: "b", solid: "b", circle: "circle-b" },
    O: { duotone: "o", solid: "o", circle: "circle-o" },
    U: { duotone: "u", solid: "u", circle: "circle-u" },
    T: { duotone: "t", solid: "t", circle: "circle-t" },
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
      <i
        className={`fa-${isCircle ? "regular" : isDuotone ? "duotone" : "solid"} fa-${selectedIcon} fa-2x ${isBeat && `fa-beat`}`}
        style={{ color, opacity: isDuotone ? 0.5 : 1 }}
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
