import { motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

const ITEM_HEIGHT = 34;

interface IRulletPicker {
  rulletIndex: number;
  text: string;
  rulletItemArr: string[];
  setRulletIndex: (idx: number) => void;
}

export default function RulletPicker({
  rulletIndex,
  text,
  rulletItemArr,
  setRulletIndex,
}: IRulletPicker) {
  const [index, setIndex] = useState<number>(rulletIndex);

  const y = useMotionValue(0);

  useEffect(() => {
    handleDragEnd();
  }, []);

  useEffect(() => {
    setRulletIndex(index);
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

    setIndex(activeItem < 0 ? 0 : activeItem > 20 ? 20 : activeItem);
  };

  const onClick = (idx: number) => {
    const targetY = -ITEM_HEIGHT * (idx - 2);
    y.set(targetY);
  };

  return (
    <>
      <Text>{text}</Text>
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
            <Item key={idx} onClick={() => onClick(idx)} isActive={index === idx}>
              {item}
            </Item>
          ))}
        </ItemsContainer>
        <Highlight />
      </Container>
    </>
  );
}

const Text = styled.div`
  color: var(--gray-600); /* text-gray-3 */
  margin-bottom: 8px; /* mb-2 */
  font-weight: 600; /* font-semibold */
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  border-radius: var(--rounded-lg); /* rounded-lg */
  background-color: var(--gray-200); /* bg-gray-8 */
  overflow-y: hidden;
  padding-top: 8px; /* py-2 */
  padding-bottom: 8px; /* py-2 */
  height: ${ITEM_HEIGHT * 5 + 16}px;
`;

const ItemsContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

const Item = styled.div<{ isActive: boolean }>`
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600; /* font-semibold */
  font-size: 16px; /* text-base */
  height: ${ITEM_HEIGHT}px;
  color: ${({ isActive }) => (isActive ? "#FFFFFF" : "var(--gray-600)")}; /* Conditional color */
`;

const Highlight = styled.div`
  border-radius: var(--rounded-lg); /* rounded-lg */
  width: 100%;
  background-color: var(--gray-800); /* bg-gray-2 */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 0;
  height: ${ITEM_HEIGHT}px;
`;
