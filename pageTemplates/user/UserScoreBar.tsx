import { Box, Button, Flex } from "@chakra-ui/react";

import ProgressMark from "../../components/molecules/ProgressMark";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";

interface UserScoreBarProps {
  score: number;
}

function UserScoreBar({ score }: UserScoreBarProps) {
  const userInfo = useUserInfo();
  const isGuest = userInfo?.role === "guest";
  console.log(1, userInfo);
  return (
    <>
      <Flex mx={5} flexDir="column" my={3} py={2} pb={1} border="var(--border)" borderRadius="8px">
        <Box px={3}>
          <ProgressMark value={score} />
        </Box>
        <BarButton isGuest={isGuest} />
      </Flex>
    </>
  );
}

export default UserScoreBar;

export function BarButton({ isGuest }: { isGuest: boolean }) {
  const toast = useToast();
  const typeToast = useTypeToast();
  return (
    <Flex mt={2}>
      <Button
        pt={0.5}
        pb={1.5}
        px={2}
        variant="unstyled"
        color="var(--color-gray)"
        ml="auto"
        border="none"
        w="max-content"
        fontSize="10px"
        lineHeight="14px"
        rightIcon={
          <Flex transform="translateY(2.7px)" alignItems="center" justifyContent="center" h="14px">
            <BarRightIcon />
          </Flex>
        }
        iconSpacing={0.5}
        onClick={() => {
          if (isGuest) {
            typeToast("guest");
          } else {
            toast("info", "준비중");
          }
        }}
      >
        동아리 점수 가이드
      </Button>
    </Flex>
  );
}

export function BarRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14px"
      viewBox="0 -960 960 960"
      width="14px"
      fill="var(--color-gray)"
    >
      <path d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z" />
    </svg>
  );
}
