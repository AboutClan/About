import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import BottomFixedButton from "../../../components/atoms/BottomFixedButton";
import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import { GROUP_STUDY, USER_INFO } from "../../../constants/keys/queryKeys";
import { useErrorToast, useToast } from "../../../hooks/custom/CustomToast";
import {
  useGroupParticipationMutation,
  useGroupWaitingMutation,
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

  const { mutate: participate } = useGroupParticipationMutation("post", +id, {
    onSuccess() {
      toast("success", "가입이 완료되었습니다.");
      queryClient.invalidateQueries([USER_INFO]);
      queryClient.invalidateQueries([GROUP_STUDY, id]);
    },
    onError() {
      toast("warning", "보유중인 티켓이 부족합니다.");
    },
  });

  const { mutate: sendRegisterForm } = useGroupWaitingMutation(+id, {
    onSuccess() {
      toast("success", "대기 요청 완료! 이후 연락 예정.");

      queryClient.invalidateQueries([GROUP_STUDY, id]);
    },
  });

  const url = router.asPath;
  const myUid = session?.user.uid;

  const isPending = data.waiting.find((who) => who.user.uid === myUid);

  const groupId = router.query.id;

  const isFull = data?.memberCnt.max !== 0 && data?.participants.length >= data?.memberCnt.max;

  const queryClient = useQueryClient();
  const { mutate: cancel } = useGroupParticipationMutation("delete", +groupId, {
    onSuccess() {
      toast("success", "신청이 취소되었습니다.");
      queryClient.invalidateQueries([GROUP_STUDY, id]);
    },
    onError: errorToast,
  });

  const onClick = (type: ButtonType) => {
    if (type === "cancel") cancel();
    const myTicket = userInfo?.ticket?.groupStudyTicket;
    if (myTicket < (data?.meetingType === "online" ? 1 : 2)) {
      toast("warning", "보유중인 티켓이 부족합니다.");
      return;
    }

    if (type === "participate") router.push(`${url}/participate`);
    if (type === "register") participate();
  };

  const getButtonSettings = () => {
    if (isPending) {
      if (data?.participants.length <= 1) {
        return {
          text: "오픈 대기중",
        };
      }
      return {
        text: "가입 대기중",
      };
    }
    if (isFull) {
      return {
        text: "빈자리 생기면 참여 요청",
        handleFunction: () => setIsModal(true),
      };
    }
    if (data?.participants.length <= 1) {
      return {
        text: "참여 대기 신청",
        handleFunction: () => sendRegisterForm({ answer: "참여 대기 신청", pointType: "point" }),
      };
    }

    return {
      text: "가입 신청",
      handleFunction: data.fee ? () => onClick("participate") : () => setIsModal(true),
    };
  };

  const { text, handleFunction } = getButtonSettings();

  return (
    <>
      <BottomFixedButton
        text={text}
        func={handleFunction}
        color={text === "빈자리 생기면 참여 요청" ? "black" : "mint"}
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
            {data.questionText
              ? "모임장의 승인이 필요한 소모임이에요."
              : "즉시 가입이 가능한 소모임이에요."}
            <br /> {data.questionText ? "참여를 희망하시나요?" : "활동을 시작해볼까요?"}
          </Box>
          <Box color="gray.500" mr="auto" fontSize="12px" fontWeight={600}>
            {data?.meetingType === "online" ? "온라인" : "오프라인"} 활동 소모임으로,{" "}
            <b>참여권 {data?.meetingType === "online" ? 1 : 2}개가 소모됩니다.</b>
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
              onClick={() => (data.questionText ? onClick("participate") : onClick("register"))}
            >
              {data.questionText ? "가입 신청하기" : "가입하기"}
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
