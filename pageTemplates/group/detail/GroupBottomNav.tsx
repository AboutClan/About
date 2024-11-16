import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import BottomFixedButton from "../../../components/atoms/BottomFixedButton";
import BottomFlexDrawer from "../../../components/organisms/drawer/BottomFlexDrawer";
import { GROUP_STUDY } from "../../../constants/keys/queryKeys";
import { useCompleteToast, useErrorToast } from "../../../hooks/custom/CustomToast";
import { useGroupParticipationMutation } from "../../../hooks/groupStudy/mutations";
import { transferGroupDataState } from "../../../recoils/transferRecoils";
import { IGroup } from "../../../types/models/groupTypes/group";

interface IGroupBottomNav {
  data: IGroup;
}

type ButtonType = "cancel" | "participate" | "expire" | "register";

function GroupBottomNav({ data }: IGroupBottomNav) {
  const router = useRouter();
  const completeToast = useCompleteToast();
  const { id } = useParams<{ id: string }>() || {};
  const setTransferGroup = useSetRecoilState(transferGroupDataState);

  const errorToast = useErrorToast();
  const { data: session } = useSession();

  const [isModal, setIsModal] = useState(false);

  const { mutate: participate } = useGroupParticipationMutation("post", +id, {
    onSuccess() {
      completeToast("free", "가입이 완료되었습니다.");
      setTransferGroup(null);
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
      completeToast("free", "참여 신청이 취소되었습니다.", true);
      queryClient.invalidateQueries([GROUP_STUDY, id]);
    },
    onError: errorToast,
  });

  const onClick = (type: ButtonType) => {
    if (type === "cancel") cancel();
    if (type === "participate") router.push(`${url}/participate`);
    if (type === "register") participate();
  };

  const getButtonSettings = () => {
    if (isFull) {
      return {
        text: "모집 인원 마감",
      };
    }
    if (isPending)
      return {
        text: "가입 대기중",
      };
    return {
      text: "가입 신청",
      handleFunction: data.fee ? () => onClick("participate") : () => setIsModal(true),
    };
  };

  const { text, handleFunction } = getButtonSettings();

  return (
    <>
      <BottomFixedButton text={text} func={handleFunction} />
      {isModal && (
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
            {data.questionText
              ? "모임장의 승인이 필요한 소모임이에요."
              : "즉시 가입이 가능한 소모임이에요."}
            <br /> {data.questionText ? "참여를 희망하시나요?" : "활동을 시작해볼까요?"}
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
              size="lg"
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
