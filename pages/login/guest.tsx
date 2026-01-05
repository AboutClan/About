import { Box, Flex } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

import Avatar from "../../components/atoms/Avatar";
import BottomNav from "../../components/layouts/BottomNav";
import Header from "../../components/layouts/Header";
import RegisterLayout from "../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../pageTemplates/register/RegisterOverview";

type Button = "home" | "cafe-map";

function LoginGuest() {
  const [method, setMethod] = useState<Button>("home");
  const [isLoading, setIsLoading] = useState(false);

  const onClickNext = () => {
    setIsLoading(true);
    signIn("guest", { callbackUrl: `${window.location.origin}/${method}` });
  };

  return (
    <>
      <Header title="" url="/login" />
      <RegisterLayout errorMessage={null}>
        <Box h="56px" />
        <RegisterOverview>
          <span>어떤 페이지에 방문하고 싶나요?</span>
          <span>둘러보고 싶은 페이지를 선택해 주세요!</span>
        </RegisterOverview>
        <Flex flexDir="column">
          <Flex
            align="center"
            p={4}
            border={method === "home" ? "var(--border-mint)" : "var(--border-main)"}
            borderWidth="2px"
            borderRadius="8px"
            onClick={() => setMethod("home")}
            mb={3}
          >
            <Flex justify="center" align="center" mr={3}>
              <Avatar user={{ avatar: { type: 17, bg: 6 } }} size="md1" />
            </Flex>
            <Flex flexDir="column">
              <Box mb="1px" fontSize="15px" color="gray.800" fontWeight="semibold">
                ABOUT
              </Box>
              <Box fontSize="13px" color="gray.500">
                스터디·취미·소셜 모임을 구경하고 싶어요!
              </Box>
            </Flex>
          </Flex>
          <Flex
            align="center"
            p={4}
            border={method !== "home" ? "var(--border-mint)" : "var(--border-main)"}
            borderWidth="2px"
            borderRadius="8px"
            onClick={() => setMethod("cafe-map")}
            mb={2}
          >
            <Flex justify="center" align="center" mr={3}>
              <Avatar user={{ avatar: { type: 4, bg: 0 } }} size="md1" />
            </Flex>
            <Flex flexDir="column">
              <Box mb="1px" fontSize="15px" color="gray.800" fontWeight="semibold">
                카공 지도
              </Box>
              <Box fontSize="13px" color="gray.500">
                공부하기 좋은 카페 모음을 보고 싶어요!
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </RegisterLayout>
      <BottomNav onClick={onClickNext} text="방문하기" isLoading={isLoading} />
    </>
  );
}

export default LoginGuest;
