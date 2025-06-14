import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import AlertModal from "../../../components/AlertModal";
import BottomFixedButton from "../../../components/atoms/BottomFixedButton";
import { Input } from "../../../components/atoms/Input";
import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useFeedsQuery } from "../../../hooks/feed/queries";
import {
  useGatherParticipationMutation,
  useGatherWaitingMutation,
  useGatherWaitingStatusMutation,
} from "../../../hooks/gather/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import GatherExpireModal from "../../../modals/gather/gatherExpireModal/GatherExpireModal";
import GatherReviewDrawer from "../../../modals/gather/gatherExpireModal/GatherReviewDrawer";
import {
  transferFeedSummaryState,
  transferGatherDataState,
} from "../../../recoils/transferRecoils";
import { FeedProps } from "../../../types/models/feed";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUser, IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../../utils/convertUtils/convertTypes";
interface IGatherBootmNav {
  data: IGather;
}

type ButtonType = "cancel" | "participate" | "expire" | "register" | "review";

function GatherBootmNav({ data }: IGatherBootmNav) {
  const { id } = useParams<{ id: string }>() || {};
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();
  const inputRef = useRef(null);
  const setTransferGather = useSetRecoilState(transferGatherDataState);

  const { data: session } = useSession();

  const { data: userInfo } = useUserInfoQuery();
  const myGather = (data.user as IUserSummary).uid === userInfo?.uid;
  const [isReviewDrawer, setIsReviewDrawer] = useState(false);
  const [isExpirationModal, setIsExpirationModal] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [value, setValue] = useState("");
  const [isCancelModal, setIsCancelModal] = useState(false);

  const setTransferFeedSummary = useSetRecoilState(transferFeedSummaryState);

  const { mutate: participate, isLoading: isLoading1 } = useGatherParticipationMutation(
    "post",
    +id,
    {
      onSuccess() {
        typeToast("participate");
        setTransferGather(null);
        queryClient.invalidateQueries([GATHER_CONTENT, id]);
        setIsModal(false);
      },
    },
  );

  const { mutate: sendRegisterForm, isLoading: isLoading2 } = useGatherWaitingMutation(+id, {
    onSuccess() {
      typeToast("apply");
      setTransferGather(null);
      queryClient.invalidateQueries([GATHER_CONTENT, id]);
      setIsModal(false);
    },
  });

  const { mutate } = useGatherWaitingStatusMutation(+id, {
    onSuccess() {
      toast("success", "취소되었습니다.");
      queryClient.refetchQueries([GATHER_CONTENT, id + ""]);
    },
    onError() {
      toast("error", "상대가 보유중인 참여권이 없습니다.");
      queryClient.refetchQueries([GATHER_CONTENT, id + ""]);
    },
  });

  const { data: feed } = useFeedsQuery("gather", data?.id, null, true, {
    enabled: !!data?.id && data.status === "open",
  });

  const isMax = data?.memberCnt.max !== 0 && data?.participants.length + 1 >= data?.memberCnt.max;
  const myUid = session?.user.uid;
  const isParticipant = data?.participants.some((who) => who?.user && who.user.uid === myUid);
  const groupId = router.query.id;

  const queryClient = useQueryClient();
  const { mutate: cancel } = useGatherParticipationMutation("delete", +groupId, {
    onSuccess() {
      setIsCancelModal(false);
      typeToast("cancel");
      setTransferGather(null);
      queryClient.invalidateQueries([GATHER_CONTENT, id]);
    },
  });

  useEffect(() => {
    setIsFirstPage(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, [isModal]);

  const onClick = (type: ButtonType) => {
    if (type === "cancel") cancel();
    if (type === "expire") setIsExpirationModal(true);
    if (type === "review") {
      router.push(`/feed/writing/gather?id=${data.id}`);
    }
  };

  const getButtonSettings = () => {
    switch (data?.status) {
      case "open":
        if (feed) {
          return {
            text: "모임 후기 도착! 확인하러 가기",
            handleFunction: () => setIsReviewDrawer(true),
          };
        }

        if (myGather || isParticipant) {
          return {
            text: "모임 리뷰 쓰고 포인트 받기",
            handleFunction: () => onClick("review"),
          };
        } else if (data.status === "open") {
          return {
            text: "종료된 모임",
          };
        } else {
          return {
            text: "빈자리 생기면 참여 요청",
            handleFunction: () => sendRegisterForm({ phase: "first" }),
          };
        }
      case "close":
        return {
          text: "취소된 모임입니다.",
        };
    }
    if (data?.waiting.some((who) => who.user._id === session?.user.id)) {
      return { text: "참여 승인을 기다리고 있습니다." };
    }

    if (myGather) return { text: "모집 종료", handleFunction: () => onClick("expire") };
    if (isParticipant) {
      return { text: "참여 취소", handleFunction: () => onClick("cancel") };
    }

    if (isMax) {
      return {
        text: "빈자리 생기면 참여 요청",
        handleFunction: () => sendRegisterForm({ phase: "first" }),
      };
    }

    return {
      text: "참여하기",
      handleFunction: () => {
        const myOld = birthToAge(userInfo.birth);

        if ((data.age[0] !== 19 && myOld < data.age[0]) || myOld > data.age[1]) {
          toast("error", "나이 조건이 맞지 않습니다.");
          return;
        }

        if (data.genderCondition) {
          const organizerGender = (data.user as IUser).gender;

          const participants = data.participants;
          let manCnt = participants.filter((who) => (who.user as IUser).gender === "남성").length;
          let womanCnt = participants.length - manCnt;
          if (organizerGender === "남성") manCnt++;
          else womanCnt++;

          if (userInfo.gender === "남성") {
            if (
              (womanCnt === 0 && manCnt >= 3) ||
              (womanCnt === 1 && manCnt >= 4) ||
              (womanCnt >= 2 && manCnt >= womanCnt * 2)
            ) {
              toast("error", "현재 멤버의 성별이 맞지 않습니다. 참여 대기 신청만 가능합니다.");
            }
          }
          if (userInfo.gender === "여성") {
            if (
              (manCnt === 0 && womanCnt >= 3) ||
              (manCnt === 1 && womanCnt >= 4) ||
              (manCnt >= 2 && womanCnt >= manCnt * 2)
            ) {
              toast("error", "현재 멤버의 성별이 맞지 않습니다. 참여 대기 신청만 가능합니다.");
            }
          }
        }

        setIsModal(true);
        onClick("participate");
      },
    };
  };

  useEffect(() => {
    if (data?.status === "open" && (myGather || isParticipant)) {
      setTransferFeedSummary({
        url: `/gather/${data.id}`,
        title: data.title,
        subCategory: data.type.subtitle,
        writer: (data.user as IUser)._id,
      });
    }
  }, [data?.status]);

  const { text, handleFunction } = getButtonSettings();

  useEffect(() => {
    if (value === data?.password) {
      participate({ phase: "first", isFree: true });
    }
  }, [value]);

  const handleParticipate = (type: "participate" | "apply", phase: "first" | "second") => {
    if (isLoading1 || isLoading2) return;
    if (userInfo?.ticket?.gatherTicket <= 0) {
      toast("error", "보유한 번개 참여권이 없습니다.");
      return;
    }
    if (type === "participate") participate({ phase });
    else if (type === "apply") sendRegisterForm({ phase });
  };

  const diffDate = dayjs(data.date).startOf("d").diff(dayjs().startOf("d"), "d");

  return (
    <>
      {text !== "참여 승인을 기다리고 있습니다." ? (
        <BottomFixedButton
          text={text}
          func={text === "참여 취소" ? () => setIsCancelModal(true) : handleFunction}
          color={
            text === "참여 취소" ? "red" : text === "빈자리 생기면 참여 요청" ? "black" : "mint"
          }
        />
      ) : (
        <Flex
          position="fixed"
          bottom={0}
          w="full"
          borderTop="var(--border)"
          align="center"
          bg="gray.200"
          h="calc(64px + env(safe-area-inset-bottom))"
          pt={2}
          pb="calc(8px + env(safe-area-inset-bottom))"
          px={5}
        >
          <Box flex={1} fontSize="14px" fontWeight="semibold" color="gray.600">
            모임장의 참여 승인을 기다리고 있습니다.
          </Box>
          <Button
            size="md"
            colorScheme="red"
            onClick={() => {
              mutate({ userId: session?.user.id, status: "refuse", text: null });
            }}
          >
            신청 취소
          </Button>
        </Flex>
      )}
      {isExpirationModal && <GatherExpireModal gather={data} setIsModal={setIsExpirationModal} />}
      {isModal && (
        <BottomFlexDrawer
          isOverlay
          isDrawerUp
          setIsModal={() => setIsModal(false)}
          isHideBottom
          drawerOptions={{ footer: { text: "취소", func: () => setIsModal(false) } }}
          height={249}
          zIndex={800}
        >
          {isFirstPage ? (
            <>
              <Button
                h="52px"
                justifyContent="flex-start"
                display="flex"
                alignItems="center"
                variant="unstyled"
                py={4}
                w="100%"
                onClick={() =>
                  handleParticipate(data?.isApprovalRequired ? "apply" : "participate", "first")
                }
              >
                <Flex justify="center" align="center" w="20px" h="20px" mr={4} opacity={0.28}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#424242"
                  >
                    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-20-520v280q0 17 11.5 28.5T500-280q17 0 28.5-11.5T540-320v-320q0-17-11.5-28.5T500-680h-80q-17 0-28.5 11.5T380-640q0 17 11.5 28.5T420-600h40Z" />
                  </svg>
                </Flex>
                <Box fontSize="13px" color="var(--gray-600)">
                  1차 참여 신청
                </Box>
              </Button>
              <Button
                h="52px"
                justifyContent="flex-start"
                display="flex"
                variant="unstyled"
                py={4}
                w="100%"
                onClick={() =>
                  handleParticipate(data?.isApprovalRequired ? "apply" : "participate", "second")
                }
              >
                <Flex justify="center" align="center" w="20px" h="20px" mr={4} opacity={0.28}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#424242"
                  >
                    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm80-200q17 0 28.5-11.5T600-320q0-17-11.5-28.5T560-360H440v-80h80q33 0 56.5-23.5T600-520v-80q0-33-23.5-56.5T520-680H400q-17 0-28.5 11.5T360-640q0 17 11.5 28.5T400-600h120v80h-80q-33 0-56.5 23.5T360-440v120q0 17 11.5 28.5T400-280h160Z" />
                  </svg>
                </Flex>
                <Box fontSize="13px" color="var(--gray-600)">
                  2차 참여 신청
                </Box>
              </Button>
              <Button
                h="52px"
                justifyContent="flex-start"
                display="flex"
                variant="unstyled"
                py={4}
                w="100%"
                onClick={() => setIsFirstPage(false)}
              >
                <Flex justify="center" align="center" w="20px" h="20px" mr={4} opacity={0.28}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#424242"
                  >
                    <path d="M480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30ZM396-288h132q29.7 0 50.85-21.15Q600-330.3 600-360v-72q0-20-14-34t-34-14q20 0 34-14t14-34v-72q0-29.7-21.15-50.85Q557.7-672 528-672H396q-15.3 0-25.65 10.29Q360-651.42 360-636.21t10.35 25.71Q380.7-600 396-600h132v84h-60q-15.3 0-25.65 10.29Q432-495.42 432-480.21t10.35 25.71Q452.7-444 468-444h60v84H396q-15.3 0-25.65 10.29Q360-339.42 360-324.21t10.35 25.71Q380.7-288 396-288Z" />
                  </svg>
                </Flex>
                <Box fontSize="13px" color="var(--gray-600)">
                  초대 코드로 입장
                </Box>
              </Button>
            </>
          ) : (
            <>
              <Box lineHeight="32px" mr="auto" mt={3} mb={1} fontSize="20px" fontWeight="semibold">
                초대코드를 입력해 주세요.
              </Box>
              <Box mr="auto" color="gray.500" fontSize="13px" lineHeight="20px">
                사전에 얘기 된 인원은 자유 참여가 가능합니다. (직접 요청 금지)
              </Box>
              <Input
                mt="auto"
                bgColor="white"
                placeholder="초대 코드"
                ref={inputRef}
                onChange={(e) => setValue(e.target?.value)}
                value={value}
                h="48px"
                textAlign="center"
                fontSize="14px"
                focusBorderColor="gray.500"
                borderColor="gray.200"
                bg="gray.100"
                boxShadow="none !important"
                _placeholder={{
                  color: "var(--gray-500)",
                }}
              />
            </>
          )}
        </BottomFlexDrawer>
      )}
      {isReviewDrawer && (
        <GatherReviewDrawer
          feed={feed as FeedProps}
          isOpen
          onClose={() => setIsReviewDrawer(false)}
        />
      )}
      {isCancelModal && (
        <AlertModal
          options={{
            title: "참여 취소",
            text: "취소합니다",
            defaultText: "닫기",
            func: () => handleFunction(),
          }}
          setIsModal={setIsCancelModal}
        >
          참여를 취소하시겠어요?
          {diffDate < 2 && <br />}
          <Box>
            {diffDate < 2 &&
              (diffDate === 1 ? (
                <>
                  모임 하루 전으로{" "}
                  <Box as="b" color="red">
                    1,000 Point
                  </Box>
                  만 반환됩니다.
                </>
              ) : (
                "모임 당일로 보증금이 반환되지 않습니다."
              ))}
          </Box>
        </AlertModal>
      )}
    </>
  );
}

export default GatherBootmNav;
