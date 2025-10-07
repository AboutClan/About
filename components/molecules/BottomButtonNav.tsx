import { Button, Flex } from "@chakra-ui/react";

import { useTypeToast } from "../../hooks/custom/CustomToast";

interface BottomButtonNavProps {
  text: string;
  handleClick: () => void;
  isReverse: boolean;
  colorScheme?: "mint" | "red" | "black";
  hasHeart?: boolean;
  isLoading?: boolean;
}

function BottomButtonNav({
  handleClick,
  text,
  isReverse,
  colorScheme = "mint",
  hasHeart = true,
  isLoading,
}: BottomButtonNavProps) {
  const typeToast = useTypeToast();
  return (
    <Flex
      position="fixed"
      bottom={0}
      w="full"
      borderTop="var(--border-main)"
      align="center"
      bg="white"
      h="calc(72px + env(safe-area-inset-bottom))"
      pt={3}
      pb="calc(12px + env(safe-area-inset-bottom))"
      px={5}
    >
      {hasHeart && (
        <Button
          variant="unstyled"
          mr={5}
          onClick={() => {
            typeToast("not-yet");
          }}
        >
          <HeartIcon />
        </Button>
      )}
      <Button
        variant={isReverse ? "subtle" : "solid"}
        size="lg"
        flex={1}
        borderRadius="full"
        colorScheme={colorScheme}
        onClick={handleClick}
        isLoading={isLoading}
      >
        {text}
      </Button>
    </Flex>
  );
}

export default BottomButtonNav;

function HeartIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="var(--gray-500)"
  >
    <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Zm-38-543q-29-41-62-62.5T300-774q-60 0-100 40t-40 100q0 52 37 110.5T285.5-410q51.5 55 106 103t88.5 79q34-31 88.5-79t106-103Q726-465 763-523.5T800-634q0-60-40-100t-100-40q-47 0-80 21.5T518-690q-7 10-17 15t-21 5q-11 0-21-5t-17-15Zm38 189Z" />
  </svg>
}
