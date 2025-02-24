import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import BottomFixedButton from "../../components/atoms/BottomFixedButton";
import BottomFlexDrawer from "../../components/organisms/drawer/BottomFlexDrawer";
import { GATHER_CONTENT } from "../../constants/keys/queryKeys";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useFeedsQuery } from "../../hooks/feed/queries";
import {
  useGatherParticipationMutation,
  useGatherWaitingMutation,
} from "../../hooks/gather/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import GatherExpireModal from "../../modals/gather/gatherExpireModal/GatherExpireModal";
import { transferFeedSummaryState, transferGatherDataState } from "../../recoils/transferRecoils";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { IUser, IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../utils/convertUtils/convertTypes";

interface IGatherParticipateDrawer {
  data: IGather;
}

type ButtonType = "cancel" | "participate" | "expire" | "register" | "review";

function GatherParticipateDrawer({ data }: IGatherParticipateDrawer) {
  const { id } = useParams<{ id: string }>() || {};
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();

  const setTransferGather = useSetRecoilState(transferGatherDataState);

  const { data: session } = useSession();

  const { data: userInfo } = useUserInfoQuery();
  const myGather = (data.user as IUserSummary).uid === userInfo?.uid;
  const [isReviewDrawer, setIsReviewDrawer] = useState(false);
  const [isExpirationModal, setIsExpirationModal] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isModal, setIsModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  console.log(isReviewDrawer, isExpirationModal);

  const setTransferFeedSummary = useSetRecoilState(transferFeedSummaryState);
  const { mutate: participate } = useGatherParticipationMutation("post", +id, {
    onSuccess() {
      typeToast("participate");
      setTransferGather(null);
      queryClient.invalidateQueries([GATHER_CONTENT, id]);
      setIsModal(false);
    },
  });

  const { mutate: sendRegisterForm } = useGatherWaitingMutation(+id, {
    onSuccess() {
      typeToast("apply");
      setTransferGather(null);
      queryClient.invalidateQueries([GATHER_CONTENT, id]);
      setIsModal(false);
    },
  });

  const { data: feed } = useFeedsQuery("gather", data?.id, null, true, {
    enabled: !!data?.id && data.status === "open",
  });

  const myUid = session?.user.uid;
  const isParticipant = data?.participants.some((who) => who?.user && who.user.uid === myUid);
  const groupId = router.query.id;

  const queryClient = useQueryClient();
  const { mutate: cancel } = useGatherParticipationMutation("delete", +groupId, {
    onSuccess() {
      typeToast("cancel");
      setTransferGather(null);
      queryClient.invalidateQueries([GATHER_CONTENT, id]);
    },
  });

  useEffect(() => {
    if (!isModal) setIsFirstPage(true);
  }, [isModal]);

  const onClick = (type: ButtonType) => {
    if (type === "cancel") cancel();
    if (type === "participate") {
     
      setIsFirstPage(false);
    }
    if (type === "expire") setIsExpirationModal(true);
    if (type === "review") {
      router.push(`/feed/writing/gather?id=${data.id}`);
    }
  };

  const getButtonSettings = () => {
    switch (data?.status) {
      case "open":
        if (feed?.length) {
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
              setIsRegister(true);
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
              setIsRegister(true);
            }
          }
        }
         if (userInfo?.ticket?.gatherTicket <= 0) {
           toast("error", "보유한 번개 참여권이 없습니다.");
           return;
         }
        setIsModal(true);
        onClick("participate");
      },
    };
  };
  console.log(51, isFirstPage);

  useEffect(() => {
    if (data?.status === "open" && (myGather || isParticipant)) {
      setTransferFeedSummary({
        url: `/gather/${data.id}`,
        title: data.title,
        subCategory: data.type.subtitle,
      });
    }
  }, [data?.status]);

  const { text, handleFunction } = getButtonSettings();
  console.log(231415, isModal, isFirstPage);
  return (
    <>
      <BottomFixedButton
        text={text}
        func={handleFunction}
        color={text === "참여 취소" ? "red" : text === "빈자리 생기면 참여 요청" ? "black" : "mint"}
      />
      {isExpirationModal && <GatherExpireModal gather={data} setIsModal={setIsExpirationModal} />}
      {isModal &&
        (isFirstPage ? (
          <BottomFlexDrawer
            isDrawerUp
            isOverlay
            height={429}
            isHideBottom
            setIsModal={() => setIsModal(false)}
          >
            <Box
              py={3}
              lineHeight="32px"
              w="100%"
              fontWeight="semibold"
              fontSize="20px"
              textAlign="start"
            >
              {data.isApprovalRequired
                ? "모임장의 승인이 필요한 모임이에요."
                : "즉시 가입이 가능한 소모임이에요."}
              <br /> {data.isApprovalRequired ? "참여를 희망하시나요?" : "활동을 시작해볼까요?"}
            </Box>
            <Box p={5}>
              {isFirstPage ? (
                <Image
                  src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/freepik__background__12597-removebg-preview.png"
                  width={160}
                  height={160}
                  alt="studyResult"
                />
              ) : (
                <></>
              )}
            </Box>

            <Flex direction="column" mt="auto" w="100%">
              <Button
                w="full"
                size="lg"
                colorScheme="black"
                onClick={() =>
                  isRegister
                    ? onClick("register")
                    : data.isApprovalRequired
                    ? onClick("participate")
                    : onClick("register")
                }
              >
                {!isFirstPage
                  ? "1차로 신청하기"
                  : data.isApprovalRequired
                  ? "참여 신청하기"
                  : "가입하기"}
              </Button>
              {!isFirstPage && (
                <Button
                  mt={3}
                  w="full"
                  size="lg"
                  colorScheme="black"
                  onClick={() =>
                    isRegister
                      ? onClick("register")
                      : data.isApprovalRequired
                      ? onClick("participate")
                      : onClick("register")
                  }
                >
                  {!isFirstPage
                    ? "2차로 신청하기"
                    : data.isApprovalRequired
                    ? "참여 신청하기"
                    : "가입하기"}
                </Button>
              )}
              <Button
                my={2}
                size="md"
                color="gray.700"
                fontWeight="semibold"
                variant="ghost"
                onClick={() => setIsModal(false)}
              >
                다음에 할게요
              </Button>
            </Flex>
          </BottomFlexDrawer>
        ) : (
          <BottomFlexDrawer
            isOverlay
            isDrawerUp
            setIsModal={() => setIsModal(false)}
            isHideBottom
            drawerOptions={{ footer: { text: "취소", func: () => setIsModal(false) } }}
            height={197}
            zIndex={800}
          >
            <Button
              h="52px"
              justifyContent="flex-start"
              display="flex"
              alignItems="center"
              variant="unstyled"
              py={4}
              w="100%"
              onClick={
                data?.isApprovalRequired
                  ? () => sendRegisterForm({ phase: "first" })
                  : () => participate({ phase: "first" })
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
              onClick={
                data?.isApprovalRequired
                  ? () => sendRegisterForm({ phase: "second" })
                  : () => participate({ phase: "second" })
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
          </BottomFlexDrawer>
        ))}
    </>
  );
}

export default GatherParticipateDrawer;
