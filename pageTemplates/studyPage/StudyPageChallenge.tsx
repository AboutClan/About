import { Box, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import SectionHeader from "../../components/atoms/SectionHeader";
import AvatarGroupsOverwrap from "../../components/molecules/groups/AvatarGroupsOverwrap";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { useAllUserDataQuery } from "../../hooks/admin/quries";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { usePointPlusLogQuery } from "../../hooks/user/queries";

function StudyPageChallenge() {
  const router = useRouter();
  const userInfo = useUserInfo();
  const toast = useToast();

  const [totalValue, setTotalValue] = useState(0);
  const [isModal, setIsModal] = useState(false);
  const { data: logs } = usePointPlusLogQuery();

  const { data: studyUsers } = useAllUserDataQuery("study");
  console.log(studyUsers);
  useEffect(() => {
    if (!logs?.length) return;

    let temp = 0;
    logs.forEach((log) => {
      temp += log.meta.value;
    });
    setTotalValue(temp);
  }, [logs]);

  const transformMinutesToHour = (minutes: number = 0) => {
    return `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`;
  };

  const record = userInfo?.studyRecord;

  return (
    <>
      <Box px={5}>
        <SectionHeader title="챌린지에 도전하고 상품 받아가세요!" subTitle="스터디 챌린지" />
        <Flex mt={4}>
          <Flex
            flexDir="column"
            alignItems="center"
            mr={2}
            flex={1}
            px={4}
            py={5}
            border="var(--border-main)"
            borderRadius="8px"
          >
            <Box fontSize="18px" lineHeight="26px" color="mint" fontWeight="bold">
              {transformMinutesToHour(record?.monthCnt)}
            </Box>
            <Box fontSize="13px" lineHeight="18px" color="gray.500" fontWeight="medium">
              스터디 참여
            </Box>
            <Box
              mt={2}
              bg="mint"
              color="white"
              borderRadius="full"
              fontSize="10px"
              fontWeight="bold"
              px={3}
              py={1.5}
            >
              {record?.accumulationCnt} 회
            </Box>
          </Flex>
          <Flex
            flexDir="column"
            alignItems="center"
            flex={1}
            px={4}
            py={5}
            border="var(--border-main)"
            borderRadius="8px"
          >
            <Box fontSize="18px" lineHeight="26px" fontWeight="bold">
              {transformMinutesToHour(record?.monthMinutes)}
            </Box>
            <Box fontSize="13px" lineHeight="18px" color="gray.500" fontWeight="medium">
              개인 공부 인증
            </Box>
            <Box
              mt={2}
              bg="gray.800"
              color="white"
              borderRadius="full"
              fontSize="10px"
              fontWeight="bold"
              px={3}
              py={1.5}
            >
              {record?.accumulationMinutes} 회
            </Box>
          </Flex>
        </Flex>
        <Flex
          borderRadius="8px"
          flexDir="column"
          align="center"
          mt={2}
          px={4}
          py={5}
          border="var(--border-main)"
        >
          <Flex align="center" h={10}>
            <AvatarGroupsOverwrap
              users={[
                { avatar: { type: 15, bg: 7 } },
                { avatar: { type: 7, bg: 3 } },
                { avatar: { type: 13, bg: 0 } },
              ]}
              maxCnt={4}
              size="lg"
            />
          </Flex>
          <Box mt={4} mb={4}>
            <b>{studyUsers?.length}명</b>의 멤버가 함께 도전중이에요!
          </Box>
          <Button
            w="full"
            borderRadius="8px"
            colorScheme="black"
            onClick={() => router.push("/ranking?tab=study")}
          >
            스터디 랭킹 보러가기
          </Button>
        </Flex>
        <Flex
          borderRadius="8px"
          flexDir="column"
          align="center"
          mt={2}
          px={4}
          py={5}
          border="var(--border-main)"
        >
          <Flex w="full" justify="space-between">
            <Box fontSize="16px">
              <Box as="span" fontWeight="bold" fontSize="18px">
                {userInfo?.name}
              </Box>
              님이
              <br />
              지금까지 적립한 리워드 💚{" "}
            </Box>

            <Box mt="auto" mb={-1} as="span" color="mint" fontSize="16px" fontWeight="extrabold">
              <Box as="u" textUnderlineOffset="6px">
                <Box as="span" fontSize="28px">
                  {totalValue.toLocaleString()}
                </Box>{" "}
                원
              </Box>
            </Box>
          </Flex>
          <Flex align="center" h={40}>
            <Image src="/32.png" alt="studyReward" width={140} height={140} />
          </Flex>

          <Button w="full" borderRadius="8px" colorScheme="black" onClick={() => setIsModal(true)}>
            포인트 사용하기
          </Button>
        </Flex>
      </Box>
      {isModal && (
        <BottomFlexDrawer
          isOverlay
          isDrawerUp
          setIsModal={() => setIsModal(false)}
          isHideBottom
          drawerOptions={{ footer: { text: "닫 기", func: () => setIsModal(false) } }}
          height={196}
          zIndex={800}
        >
          <Button
            h="52px"
            justifyContent="flex-start"
            display="flex"
            variant="unstyled"
            py={4}
            w="100%"
            lineHeight="20px"
            onClick={() => router.push("/store")}
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#424242"
              >
                <path d="M160-160v-360q-33 0-56.5-23.5T80-600v-80q0-33 23.5-56.5T160-760h128q-5-9-6.5-19t-1.5-21q0-50 35-85t85-35q23 0 43 8.5t37 23.5q17-16 37-24t43-8q50 0 85 35t35 85q0 11-2 20.5t-6 19.5h128q33 0 56.5 23.5T880-680v80q0 33-23.5 56.5T800-520v360q0 33-23.5 56.5T720-80H240q-33 0-56.5-23.5T160-160Zm400-680q-17 0-28.5 11.5T520-800q0 17 11.5 28.5T560-760q17 0 28.5-11.5T600-800q0-17-11.5-28.5T560-840Zm-200 40q0 17 11.5 28.5T400-760q17 0 28.5-11.5T440-800q0-17-11.5-28.5T400-840q-17 0-28.5 11.5T360-800ZM160-680v80h280v-80H160Zm280 520v-360H240v360h200Zm80 0h200v-360H520v360Zm280-440v-80H520v80h280Z" />
              </svg>
            </Box>
            <Box fontSize="13px" color="var(--gray-600)" fontWeight="500">
              스토어 상품 보러가기{" "}
              <Box as="span" fontSize="10px" color="mint">
                (10% 할인)
              </Box>
            </Box>
          </Button>
          <Button
            h="52px"
            justifyContent="flex-start"
            display="flex"
            variant="unstyled"
            py={4}
            w="100%"
            lineHeight="20px"
            onClick={() => {
              if (totalValue < 3000) {
                toast("info", "스터디 적립금이 3,000원 이상일 때부터 출금이 가능합니다.");
                return;
              }

              if (userInfo?.point < 11000) {
                toast("info", "포인트가 부족합니다. 출금 후 잔액이 8,000 Point 이상이어야 합니다.");
                return;
              }
              router.push("user/point/withdrawal");
            }}
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#424242"
              >
                <path d="M486-314q33 0 56.5-15.5T566-378q0-29-24.5-47T454-466q-59-21-86.5-50T340-592q0-41 28.5-74.5T446-710v-15q0-14 10.5-24.5T481-760q14 0 24.5 10.5T516-725v15q29 2 53.5 19.5T609-648q7 11 1 23.5T590-607q-13 5-26 1t-21-15q-10-12-25-19.5t-36-7.5q-35 0-53.5 15T410-592q0 26 23 41t83 35q72 26 96 61t24 77q0 29-10 51t-26.5 37.5Q583-274 561-264.5T514-250v15q0 14-10.5 24.5T479-200q-14 0-24.5-10.5T444-235v-17q-38-8-65-30t-43-56q-6-14 .5-27t20.5-18q13-5 26 .5t20 17.5q14 26 35.5 38.5T486-314Zm-6 274q-112 0-206-51T120-227v67q0 17-11.5 28.5T80-120q-17 0-28.5-11.5T40-160v-160q0-17 11.5-28.5T80-360h160q17 0 28.5 11.5T280-320q0 17-11.5 28.5T240-280h-59q48 72 126.5 116T480-120q141 0 242.5-94T838-445q2-16 14-25.5t28-9.5q17 0 29 10.5t10 25.5q-7 85-44 158.5t-96 128q-59 54.5-135.5 86T480-40Zm0-800q-141 0-242.5 94T122-515q-2 16-14 25.5T80-480q-17 0-29-10.5T41-516q7-85 44-158.5t96-128q59-54.5 135.5-86T480-920q112 0 206 51t154 136v-67q0-17 11.5-28.5T880-840q17 0 28.5 11.5T920-800v160q0 17-11.5 28.5T880-600H720q-17 0-28.5-11.5T680-640q0-17 11.5-28.5T720-680h59q-48-72-126.5-116T480-840Z" />
              </svg>
            </Box>
            <Box fontSize="13px" color="var(--gray-600)" fontWeight="500">
              현금으로 출금하기{" "}
              <Box as="span" fontSize="10px" color="mint">
                (3,000원 이상 가능)
              </Box>
            </Box>
          </Button>
        </BottomFlexDrawer>
      )}
    </>
  );
}

export default StudyPageChallenge;
