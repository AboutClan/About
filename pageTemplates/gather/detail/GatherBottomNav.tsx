import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import BottomButtonNav from "../../../components/molecules/BottomButtonNav";
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
import { ModalLayout } from "../../../modals/Modals";
import { transferGatherDataState } from "../../../recoils/transferRecoils";
import { FeedProps } from "../../../types/models/feed";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUser, UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import { birthToAge } from "../../../utils/convertUtils/convertTypes";
interface IGatherBootmNav {
  data: IGather;
  isOpenGather: boolean;
}

type ButtonType = "cancel" | "expire" | "review";

function GatherBootmNav({ data, isOpenGather }: IGatherBootmNav) {
  const { id } = useParams<{ id: string }>() || {};
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();

  const setTransferGather = useSetRecoilState(transferGatherDataState);

  const { data: session } = useSession();

  const { data: userInfo } = useUserInfoQuery();
  const myGather =
    (data.user as UserSimpleInfoProps).uid === userInfo?.uid || userInfo?.name === "어바웃";
  const [isReviewDrawer, setIsReviewDrawer] = useState(false);
  const [isExpirationModal, setIsExpirationModal] = useState(false);

  const [isModal, setIsModal] = useState(false);
  const [isCancelModal, setIsCancelModal] = useState(false);

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

  const { mutate, isLoading: isLoading3 } = useGatherWaitingStatusMutation(+id, {
    onSuccess() {
      toast("success", "참여 요청이 취소되었습니다.");
      queryClient.refetchQueries([GATHER_CONTENT, id + ""]);
    },
    onError() {
      toast("error", "상대가 보유중인 참여권이 없습니다.");
      queryClient.refetchQueries([GATHER_CONTENT, id + ""]);
    },
  });

  const { data: feed } = useFeedsQuery(data?.category as "group" | "gather", data?.id, null, true, {
    enabled: !!data?.id && !!data?.category && data.status === "open",
  });

  const isMax =
    data?.memberCnt.max !== 0 &&
    data?.participants.length +
      ((data?.user as UserSimpleInfoProps)?.uid === "3224546232" ? 0 : 1) >=
      data?.memberCnt.max;
  const myUid = session?.user.uid;
  const isParticipant = data?.participants.some((who) => who?.user && who.user.uid === myUid);
  const groupId = router.query.id;

  const queryClient = useQueryClient();
  const { mutate: cancel, isLoading: isLoading4 } = useGatherParticipationMutation(
    "delete",
    +groupId,
    {
      onSuccess() {
        setIsModal(false);
        setIsCancelModal(false);
        setIsExpirationModal(false);
        typeToast("cancel");
        queryClient.invalidateQueries([GATHER_CONTENT, id]);
      },
    },
  );

  const isLoading = isLoading1 || isLoading2 || isLoading3 || isLoading4;

  const onClick = (type: ButtonType) => {
    if (type === "cancel") cancel();
    if (type === "expire") setIsExpirationModal(true);
    if (type === "review") {
      router.push(`/feed/writing/${data.category}?id=${data.id}`);
    }
  };
  const isGuest = userInfo?.role === "guest";
  const diffDate = dayjs(data.date).startOf("d").diff(dayjs().startOf("d"), "d");

  const getButtonSettings = (): {
    text: string;
    handleFunction?: () => void;
    type?: "mint" | "red" | "black";
    isEnd?: boolean;
    isReverse?: boolean;
  } => {
    if (isOpenGather) {
      if (isParticipant) {
        if (data?.reviewers?.some((r) => r === userInfo?._id)) {
          return {
            text: "최종 결과를 기다리는 중... (D-1)",
            type: "black",
            isReverse: true,
            isEnd: true,
          };
        }
        if (data.id > 5000) {
          return {
            text: "신청 취소",
            type: "red",
            isReverse: true,
            handleFunction: () => {
              setIsCancelModal(true);
            },
          };
        }

        return {
          text: "멤버 선택하기",
          handleFunction: () => {
            router.push(`/gather/${id}/openGather`);
          },
        };
      } else {
        return {
          text: "신청이 마감되었습니다.",
          type: "black",
          isReverse: true,
          isEnd: true,
        };
      }
    }
    switch (data?.status) {
      case "open":
        if (feed) {
          return {
            text: "모임 후기 도착! 확인하러 가기",
            handleFunction: () => setIsReviewDrawer(true),
            type: "black",
            isEnd: true,
          };
        }
        if (myGather || isParticipant) {
          return {
            text: "모임 후기 쓰고 포인트 받기",
            type: "mint",
            handleFunction: () => onClick("review"),
            isEnd: true,
          };
        } else if (data.status === "open") {
          return {
            text: "참여 대기 요청",
            handleFunction: () => {
              if (isGuest) {
                router.replace({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    guest: "on",
                  },
                });
                return;
              }
              sendRegisterForm({ phase: "first" });
            },
            isReverse: true,
          };
        } else {
          return {
            text: "빈자리 생기면 참여 요청",
            handleFunction: () => {
              if (isGuest) {
                router.replace({
                  pathname: router.pathname,
                  query: {
                    ...router.query,
                    guest: "on",
                  },
                });
                return;
              }
              sendRegisterForm({ phase: "first" });
            },
            isReverse: true,
          };
        }
      case "close":
        return {
          text: "취소된 모임입니다.",
          type: "black",
          isReverse: true,
          isEnd: true,
        };
    }

    if (data?.waiting.some((who) => who?.user?._id === session?.user.id)) {
      return {
        text: "참여 승인을 기다리는 중...",
        handleFunction: () => {
          mutate({ userId: session?.user.id, status: "refuse", text: null });
        },
        isReverse: true,
      };
    }

    if (myGather)
      return {
        text: "모집 종료",
        type: "red",
        isReverse: true,
        handleFunction: () => onClick("expire"),
      };
    if (isParticipant) {
      return {
        text: "참여 취소",
        type: "red",
        isReverse: true,
        handleFunction: () => {
          setIsCancelModal(true);
        },
      };
    }

    if (isMax) {
      return {
        text: "빈자리 생기면 참여 요청",
        handleFunction: () => {
          if (isGuest) {
            router.replace({
              pathname: router.pathname,
              query: {
                ...router.query,
                guest: "on",
              },
            });
            return;
          }
          sendRegisterForm({ phase: "first" });
        },
        isReverse: true,
      };
    }

    return {
      text: data?.isApprovalRequired ? "참여 신청" : "참여하기",
      handleFunction: () => {
        if (isGuest) {
          router.replace({
            pathname: router.pathname,
            query: {
              ...router.query,
              guest: "on",
            },
          });
          return;
        }
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
      },
    };
  };

  const { text = "", handleFunction, type, isEnd = false, isReverse = false } = getButtonSettings();

  const handleParticipate = (type: "participate" | "apply") => {
    if (isLoading1 || isLoading2) return;
    // if (userInfo?.ticket?.gatherTicket <= 0) {
    //   toast("error", "보유한 번개 참여권이 없습니다.");
    //   return;
    // }
    if (type === "participate") participate({ phase: "first" });
    else if (type === "apply") sendRegisterForm({ phase: "first" });
  };

  return (
    <>
      {text && (
        <BottomButtonNav
          text={text}
          hasHeart={!isEnd}
          colorScheme={type}
          isReverse={isReverse}
          handleClick={handleFunction}
          isLoading={isLoading}
        />
      )}
      {isExpirationModal && (
        <GatherExpireModal
          gather={data}
          setIsModal={() => {
            setIsExpirationModal(false);
            setIsModal(false);
            setIsCancelModal(false);
          }}
        />
      )}
      {isModal && (
        <BottomFlexDrawer
          isDrawerUp
          isOverlay
          height={432}
          isHideBottom
          setIsModal={() => setIsModal(false)}
        >
          <Box
            py={3}
            pb={2}
            lineHeight="32px"
            w="100%"
            fontWeight="semibold"
            fontSize="20px"
            textAlign="start"
          >
            {data?.isApprovalRequired
              ? `${
                  (data.user as UserSimpleInfoProps)?.name === "어바웃" ? "운영진" : "참여"
                } 승인이 필요한 모임이에요.`
              : "즉시 참여가 가능한 모임이에요."}
            <br /> {data?.isApprovalRequired ? "모임 참여를 요청할까요?" : "모임에 참여할까요?"}
          </Box>
          <Box color="gray.500" mr="auto" fontSize="12px" fontWeight={600}>
            {data?.isApprovalRequired ? "승인되면" : null} <b>번개 참여권 1장</b>이 소모됩니다.
            (참여권은 매월 리필돼요!)
          </Box>
          <Box pt={3}>
            <Image
              src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/freepik__background__12597-removebg-preview.png"
              width={168}
              height={168}
              alt="studyResult"
            />
          </Box>
          <Flex direction="column" mt="auto" w="100%">
            <Button
              w="full"
              size="lg"
              colorScheme="black"
              onClick={() => handleParticipate(data?.isApprovalRequired ? "apply" : "participate")}
              isLoading={isLoading1 || isLoading2}
            >
              {data?.isApprovalRequired ? "참여 신청" : "참여하기"}
            </Button>
            <Button
              my={2}
              size="md"
              color="gray.600"
              fontWeight="semibold"
              variant="ghost"
              onClick={() => setIsModal(false)}
            >
              다음에 할게요
            </Button>
          </Flex>
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
        <ModalLayout
          title="모임 참여 취소"
          footerOptions={{
            main: { text: "참여 취소", func: () => cancel(), isLoading: isLoading4 },
            sub: { text: "닫기" },
            colorType: "red",
          }}
          setIsModal={() => setIsCancelModal(false)}
        >
          <Box mb={5}>
            {diffDate >= 2 ? (
              <>
                모임 {diffDate}일 전으로 참여권이 반환되며,
                <br /> 별도의 패널티가 발생하지 않습니다.
              </>
            ) : diffDate === 1 ? (
              <>
                하루 전 불참으로 <b style={{ color: "var(--color-red)" }}>1,000 Point</b>가
                차감됩니다.
              </>
            ) : (
              <>
                당일 불참으로 <b style={{ color: "var(--color-red)" }}>2,000 Point</b>가 차감됩니다.
              </>
            )}
            {diffDate <= 1 && (
              <>
                <br />
                사전에 협의된 특별한 사정이 있다면, <br />
                모임장님에게 내보내기를 요청해주세요.
              </>
            )}
          </Box>
          <Box
            px={3}
            py={3}
            bg="gray.100"
            border="var(--border)"
            borderRadius="8px"
            fontSize="12px"
            color="gray.600"
          >
            ※ 톡방에 입장하신 경우, 톡방 또는 모임장님께 불참 양해를 구해주세요. 비매너 노쇼로
            체크되는 경우, 최대 5,000원의 벌금이 발생됩니다.
          </Box>
        </ModalLayout>
      )}
    </>
  );
}

export default GatherBootmNav;
