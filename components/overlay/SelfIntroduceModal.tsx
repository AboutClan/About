import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import { USER_INFO } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserInfoMutation } from "../../hooks/user/mutations";
import { IFooterOptions, ModalLayout } from "../../modals/Modals";
import { CloseProps } from "../../types/components/modalTypes";
import Textarea from "../atoms/Textarea";

interface SelfIntroduceModal extends CloseProps {}

function SelfIntroduceModal({ onClose }: SelfIntroduceModal) {
  const toast = useToast();

  const [text, setText] = useState("");

  const queryClient = useQueryClient();

  const { mutate } = useUserInfoMutation({
    onSuccess() {
      queryClient.invalidateQueries([USER_INFO]);
      onClose();
    },
  });

  const footerOptions: IFooterOptions = {
    main: {
      text: "작성 완료",
      func: () => {
        if (text.length < 40) {
          toast("info", "조금만 더 적어주세요!");
          return;
        }
        if (text.length >= 90) {
          toast("info", "네줄 이하로 작성해주세요!");
          return;
        }

        mutate({ introduceText: text });
      },
    },
    sub: {
      text: "다음에 입력",
      func: () => {
        onClose();
      },
    },
  };

  return (
    <ModalLayout title="자기소개 등록" footerOptions={footerOptions} setIsModal={onClose}>
      <Box>자기소개를 작성해 주세요. 필수사항입니다 !</Box>
      <Box mt={4}>
        <Textarea
          h="96px"
          fontSize="12px"
          placeholder="나는 어떤 사람인가요? 사람들과 어울릴 때의 성격이나 대화 스타일을 적어주세요!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Flex ml="auto" mt={1} w="max-content" fontSize="12px" color="gray.500">
          <Box
            color={text.length >= 90 ? "red" : text.length < 40 ? "gray.500" : "gray.800"}
            mr={1}
          >
            {text.length}
          </Box>{" "}
          / {text.length >= 90 ? "최대 90자" : "최소 40자"}
        </Flex>
        <Box fontSize="12px" mt={4} bg="gray.100" w="full" px={4} py={3} borderRadius="12px">
          ex. 같이 있으면 편하다는 말 많이 듣고, 처음 본 사람이랑도 금방 어울리는 편입니다🙂
          리액션도 많이 하고, 어색하면 먼저 나서기도 해요!
        </Box>
      </Box>
    </ModalLayout>
  );
}

export default SelfIntroduceModal;
