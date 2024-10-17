import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ITEM_HEIGHT = 38;

interface IRulletPicker {
  rulletIndex: number;

  rulletItemArr: string[];
  setRulletIndex: (idx: number) => void;
}

export default function RulletPicker({
  rulletIndex,

  rulletItemArr,
  setRulletIndex,
}: IRulletPicker) {
  const [index, setIndex] = useState<number>(rulletIndex);

  useEffect(() => {
    setIndex(rulletIndex);
  }, [rulletIndex]);

  const y = useMotionValue(0);

  useEffect(() => {
    setRulletIndex(index);
    handleDragEnd();
  }, [index]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleYChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleDragEnd();
      }, 10);
    };
    const unsubscribe = y.on("change", handleYChange);
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [y, index]);

  const handleDragEnd = () => {
    const targetY = -ITEM_HEIGHT * (index - 2);

    y.set(targetY);
  };

  const handleUpdate = () => {
    const Y = y.get();
    const activeItem = Math.round(-Y / ITEM_HEIGHT) + 2;

    setIndex(activeItem < 0 ? 0 : activeItem > 22 ? 22 : activeItem);
  };

  const onClick = (idx: number) => {
    const targetY = -ITEM_HEIGHT * (idx - 2);
    y.set(targetY);
  };

  return (
    <Container>
      <ItemsContainer
        drag="y"
        dragConstraints={{
          top: -ITEM_HEIGHT * (rulletItemArr.length - 3),
          bottom: ITEM_HEIGHT * 2,
        }}
        dragElastic={0.2}
        onUpdate={handleUpdate}
        style={{ y }}
      >
        {rulletItemArr.map((item, idx) => (
          <Item
            key={idx}
            onClick={() => onClick(idx)}
            isActive={
              index === idx ? "main" : idx + 1 === index || idx - 1 === index ? "sub" : null
            }
          >
            {item}
          </Item>
        ))}
      </ItemsContainer>
      <Highlight />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  border-radius: var(--rounded-lg); /* rounded-lg */

  overflow-y: hidden;

  height: ${ITEM_HEIGHT * 5}px;
`;

const ItemsContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

const Item = styled.div<{ isActive: "main" | "sub" | null }>`
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: ${(props) => (props.isActive === "main" ? " 600" : "400")}; /* font-semibold */
  font-size: 16px; /* text-base */
  height: ${ITEM_HEIGHT}px;
  color: ${({ isActive }) =>
    isActive === "main"
      ? "var(--color-mint)"
      : isActive === "sub"
        ? "var(--gray-500)"
        : "var(--gray-400)"}; /* Conditional color */
`;

const Highlight = styled.div`
  border-radius: 8px; /* rounded-lg */
  width: 100%;
  background-color: rgba(0, 194, 179, 0.08); /* bg-gray-2 */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
  height: ${ITEM_HEIGHT}px;
`;
