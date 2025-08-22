import { Box, Button, Flex, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

import { useToast } from "../../hooks/custom/CustomToast";
import { useGatherRequestLikeMutation } from "../../hooks/gather/mutations";
import { useGatherRequestQuery } from "../../hooks/gather/queries";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getDateDiff } from "../../utils/dateTimeUtils";

function GatherPick() {
  const toast = useToast();
  const router = useRouter();

  const { data: userInfo } = useUserInfoQuery();

  const { data, refetch } = useGatherRequestQuery();

  const { mutate: updatePoint } = usePointSystemMutation("point");

  const { mutate } = useGatherRequestLikeMutation({
    onSuccess(data) {
      if ((data as unknown) === "add") {
        toast("success", "관심 번개가 개설되면 알림을 보내드릴게요!");
        updatePoint({ value: -50, message: "관심 번개 등록" });
      } else {
        updatePoint({ value: 50, message: "관심 번개 등록 해제" });
      }
      refetch();
    },
  });

  const handleLikeButton = (id: string) => {
    mutate({ grId: id });
  };

  return (
    <Box mb={20}>
      {data
        ?.slice()
        .reverse()
        .map((item) => {
          const isMyPick = item.like.includes(userInfo?._id);
          return (
            <Box
              key={item._id}
              border="var(--border)"
              bg="gray.100"
              m={5}
              borderRadius="12px"
              py={4}
              px={4}
            >
              <Flex flexDir="column" borderBottom="var(--border)">
                <Text fontSize="16px" fontWeight="semibold">
                  {item.title}
                </Text>
                <Box
                  mt={2}
                  mb={3}
                  sx={{
                    color: "var(--gray-600)",
                    fontSize: "14px",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.content}
                </Box>

                <Flex
                  mt={2}
                  fontSize="12px"
                  lineHeight="16px"
                  color="var(--gray-600)"
                  justify="space-between"
                >
                  <Flex align="center">
                    <Box>
                      <ClockIcon />
                    </Box>
                    <Box ml={1} mt={0.5}>
                      {getDateDiff(dayjs(item.createdAt))}
                    </Box>
                  </Flex>

                  <Flex ml="auto" align="center" lineHeight="16px">
                    <Box>
                      <MoneyBagIcon />
                    </Box>
                    <Box as="b" ml={1} mt={0.5} color="gray.800">
                      {(5000 + item.like.length * 150).toLocaleString()}원
                    </Box>
                  </Flex>
                </Flex>
                <Flex mt={3}>
                  <Button
                    flex={1}
                    border="var(--border)"
                    color="var(--gray-800)"
                    bg="white"
                    borderColor="var(--gray-800)"
                    borderRadius="12px"
                    onClick={() => handleLikeButton(item._id)}
                  >
                    이 번개 관심있어요 <Box mx={1}>{isMyPick ? <Heart2Icon /> : <HeartIcon />}</Box>{" "}
                    {item.like.length}
                  </Button>
                  <Button
                    w="42px"
                    h="42px"
                    bgColor="var(--gray-800)"
                    ml={2}
                    borderRadius="full"
                    border="var(--border-main)"
                    onClick={() => router.push("/gather/writing/category")}
                  >
                    <Box>
                      <ThunderIcon />
                    </Box>
                  </Button>
                </Flex>
              </Flex>
            </Box>
          );
        })}
      {/* <ModalLayout title="관심 추가" footerOptions={{ main: { text: "관심 등록" } }}>
        <Box as="b">50 Point</Box>를 사용해 리워드를 추가할 수 있어요!
        <br /> 이 번개가 개설되면, 개설자에게 모인 리워드가 지급되며 관심 요청을 한 인원들에게
        알림이 발송됩니다.
      </ModalLayout> */}
    </Box>
  );
}

function ThunderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="white"
    >
      <path d="m440-380-237-30q-25-3-32.5-27t10.5-41l409-392q5-5 12-7.5t19-2.5q20 0 30.5 17t.5 35L520-580l237 30q25 3 32.5 27T779-482L370-90q-5 5-12 7.5T339-80q-20 0-30.5-17t-.5-35l132-248Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14px"
      viewBox="0 -960 960 960"
      width="14px"
      fill="var(--gray-600)"
    >
      <path d="M520-496v-144q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v159q0 8 3 15.5t9 13.5l132 132q11 11 28 11t28-11q11-11 11-28t-11-28L520-496ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
    </svg>
  );
}

function Heart2Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-800)"
    >
      <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-800)"
    >
      <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Zm-38-543q-29-41-62-62.5T300-774q-60 0-100 40t-40 100q0 52 37 110.5T285.5-410q51.5 55 106 103t88.5 79q34-31 88.5-79t106-103Q726-465 763-523.5T800-634q0-60-40-100t-100-40q-47 0-80 21.5T518-690q-7 10-17 15t-21 5q-11 0-21-5t-17-15Zm38 189Z" />
    </svg>
  );
}

function MoneyBagIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16px"
      viewBox="0 -960 960 960"
      width="16px"
      fill="var(--gray-800)"
    >
      <path d="M480-320q-33 0-56.5-23.5T400-400q0-33 23.5-56.5T480-480q33 0 56.5 23.5T560-400q0 33-23.5 56.5T480-320ZM295-680h370l51-102q10-20-1.5-39T680-840H280q-23 0-34.5 19t-1.5 39l51 102Zm41 560h288q90 0 153-62.5T840-336q0-38-13-74t-37-65L686-600H274L170-475q-24 29-37 65t-13 74q0 91 62.5 153.5T336-120Z" />
    </svg>
  );
}

export default GatherPick;
