import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import BottomButtonNav from "../../../components/molecules/BottomButtonNav";
import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import { GROUP_STUDY, USER_INFO } from "../../../constants/keys/queryKeys";
import { useErrorToast, useToast } from "../../../hooks/custom/CustomToast";
import {
  useGroupParticipationMutation,
  useGroupWaitingMutation,
  useGroupWaitingStatusMutation,
} from "../../../hooks/groupStudy/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { IGroup } from "../../../types/models/groupTypes/group";

interface IGroupBottomNav {
  data: IGroup;
}

type ButtonType = "cancel" | "participate" | "expire" | "register";

function GroupBottomNav({ data }: IGroupBottomNav) {
  const router = useRouter();

  const toast = useToast();
  const { id } = useParams<{ id: string }>() || {};

  const { data: userInfo } = useUserInfoQuery();

  const errorToast = useErrorToast();
  const { data: session } = useSession();

  const [isModal, setIsModal] = useState(false);

  const { mutate: participate, isLoading: isLoading1 } = useGroupParticipationMutation(
    "post",
    +id,
    {
      onSuccess() {
        toast("success", "가입이 완료되었습니다.");
        queryClient.invalidateQueries([USER_INFO]);
        queryClient.invalidateQueries([GROUP_STUDY, id]);
      },
      onError() {
        toast("warning", "보유중인 티켓이 부족합니다.");
      },
    },
  );

  const { mutate: sendRegisterForm, isLoading: isLoading2 } = useGroupWaitingMutation(+id, {
    onSuccess() {
      toast("success", "대기 요청 완료! 이후 연락 예정.");

      queryClient.invalidateQueries([GROUP_STUDY, id]);
    },
  });

  const { mutate, isLoading: isLoading4 } = useGroupWaitingStatusMutation(+id, {
    onSuccess() {
      toast("success", "취소되었습니다.");
      queryClient.invalidateQueries([GROUP_STUDY, id]);
    },
  });

  const url = router.asPath;
  const myUid = session?.user.uid;

  const isPending = data?.waiting?.find((who) => who.user.uid === myUid);

  const groupId = router.query.id;

  const isFull = data?.memberCnt.max !== 0 && data?.participants.length >= data?.memberCnt.max;

  const queryClient = useQueryClient();
  const { mutate: cancel, isLoading: isLoading3 } = useGroupParticipationMutation(
    "delete",
    +groupId,
    {
      onSuccess() {
        toast("success", "신청이 취소되었습니다.");
        queryClient.invalidateQueries([GROUP_STUDY, id]);
      },
      onError: errorToast,
    },
  );

  const isLoading = isLoading1 || isLoading2 || isLoading3 || isLoading4;

  const onClick = (type: ButtonType) => {
    if (type === "cancel") cancel();
    const myTicket = userInfo?.ticket?.groupStudyTicket;
    if (myTicket < data?.requiredTicket) {
      toast("warning", "보유중인 티켓이 부족합니다.");
      return;
    }

    if (type === "participate") router.push(`${url}/participate`);
    if (type === "register") participate();
  };

  const getButtonSettings = (): {
    text: string;
    handleFunction?: () => void;
    type?: "mint" | "red" | "black";
    isEnd?: boolean;
    isReverse?: boolean;
  } => {
    if (isPending) {
      if (data?.participants.length <= 1) {
        return {
          text: "오픈 대기 취소",
          isReverse: true,
          handleFunction: () => mutate({ userId: userInfo._id, status: "refuse" }),
        };
      }
      return {
        text: "가입 대기 취소",
        isReverse: true,
        handleFunction: () => mutate({ userId: userInfo._id, status: "refuse" }),
      };
    }
    if (isFull) {
      return {
        text: "빈자리 생기면 참여 요청",
        handleFunction: () => setIsModal(true),
        isReverse: true,
      };
    }
    if (data?.participants.length <= 1) {
      return {
        text: "참여 대기 신청",
        handleFunction: data?.isFree
          ? () => sendRegisterForm({ answer: ["참여 대기 신청"], pointType: "point" })
          : () => onClick("participate"),
      };
    }

    return {
      text: "가입 신청",
      handleFunction: !data?.isFree ? () => onClick("participate") : () => setIsModal(true),
      type: "mint",
    };
  };

  const { text, handleFunction, type, isEnd, isReverse } = getButtonSettings();

  return (
    <>
      <BottomButtonNav
        text={text}
        hasHeart={!isEnd}
        colorScheme={type}
        isReverse={isReverse}
        handleClick={handleFunction}
        isLoading={isLoading}
      />
      {isModal && (
        <BottomFlexDrawer
          isDrawerUp
          isOverlay
          height={443}
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
            {!data.isFree
              ? "모임장의 승인이 필요한 소모임이에요."
              : "즉시 가입이 가능한 소모임이에요."}
            <br /> {data.questionText ? "참여를 희망하시나요?" : "활동을 시작해볼까요?"}
          </Box>
          <Box color="gray.500" mr="auto" fontSize="12px" fontWeight={600}>
            매월 <b>참여권 {data.requiredTicket}장</b>이 소모됩니다.
          </Box>
          <Box p={5}>
            <Image
              src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/freepik__background__12597-removebg-preview.png"
              width={160}
              height={160}
              alt="studyResult"
            />
          </Box>
          <Flex direction="column" mt="auto" w="100%">
            <Button
              w="full"
              size="lg"
              colorScheme="black"
              onClick={() => (!data.isFree ? onClick("participate") : onClick("register"))}
            >
              {!data.isFree ? "가입 신청하기" : "가입하기"}
            </Button>
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
      )}
    </>
  );
}

export default GroupBottomNav;
