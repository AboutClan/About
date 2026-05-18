import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import RightDrawer from "../../../components/organisms/drawer/RightDrawer";

function ReviewButton() {
  const [isDrawer, setIsDrawer] = useState(false);
  const tabs = ["최근 후기", "신규 장소"] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>("최근 후기");
  console.log(setTab);
  return (
    <>
      <Button
        rounded="full"
        bgColor="white"
        boxShadow="0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
        w="40px"
        h="40px"
        size="sm"
        p="0"
        border="var(--border-main)"
        borderWidth="1px"
        borderColor="var(--gray-300)"
        onClick={() => {
          setIsDrawer(true);
        }}
      >
        <BoardIcon />
      </Button>
      {isDrawer && (
        <RightDrawer title="카공 게시판" onClose={() => setIsDrawer(false)} px={false}>
          <Flex maxW="var(--max-width)" mx="auto" borderBottom="var(--border)">
            {tabs.map((text, idx) => {
              const selected = tab === text;
              return (
                <Button
                  borderRadius="0"
                  key={tab}
                  position="relative"
                  flex={1}
                  variant="unstyled"
                  fontSize="14px"
                  fontWeight={selected ? 700 : 500}
                  py={3}
                  bg={selected ? "white" : "var(--gray-100)"}
                  border="var(--border-main)"
                  borderLeft={idx === 1 ? "var(--border-main)" : "none"}
                  borderRight={idx === 1 ? "var(--border-main)" : "none"}
                  borderBottom={selected ? "2px solid var(--color-mint)" : "var(--border-main)"}
                >
                  {text}
                </Button>
              );
            })}
          </Flex>
        </RightDrawer>
      )}
    </>
  );
}

export default ReviewButton;
export function BoardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="19px"
      viewBox="0 -960 960 960"
      width="19px"
      fill="var(--gray-800)"
    >
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm120-80h200q17 0 28.5-11.5T560-320q0-17-11.5-28.5T520-360H320q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160h320q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160h320q17 0 28.5-11.5T680-640q0-17-11.5-28.5T640-680H320q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm181.5-198.5Q510-807 510-820t-8.5-21.5Q493-850 480-850t-21.5 8.5Q450-833 450-820t8.5 21.5Q467-790 480-790t21.5-8.5ZM200-200v-560 560Z" />
    </svg>
  );
}
