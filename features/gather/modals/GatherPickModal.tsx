import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import { Input } from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import { ModalLayout } from "@/components/modals/Modals";
import { useGatherRequestMutation } from "@/features/gather/hooks/mutations";
import { useToast } from "@/hooks/custom/CustomToast";
import { IModal } from "@/types/components/modalTypes";

function GatherPickModal({ setIsModal }: IModal) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useGatherRequestMutation({
    onSuccess() {
      queryClient.refetchQueries(["gatherRequest"]);
      setIsModal(false);
    },
  });

  const handleSubmit = () => {
    if (!title || !content) {
      toast("warning", "내용을 작성해 주세요.");
    }

    mutate({
      title,
      content,
      isAnonymous,
    });
  };

  return (
    <ModalLayout
      title="이런 번개 열어주세요!"
      footerOptions={{ main: { text: "완 료", func: handleSubmit, isLoading } }}
      setIsModal={setIsModal}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="원하는 모임을 적어주세요."
        size="sm"
        px={3}
      />
      <Textarea
        my={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="하고 싶은 말을 남겨주세요."
        px={3}
        h="80px"
      />
      <Flex align="center" justify="space-between">
        <Flex>
          <Text mr={2} fontSize="12px" color="gray.600" lineHeight="20px">
            익명 체크
          </Text>
          <Switch
            colorScheme="mint"
            isChecked={isAnonymous}
            onChange={() => setIsAnonymous((old) => !old)}
          />
        </Flex>
        <Box lineHeight="20px" fontSize="12px" color="mint">
          {isAnonymous ? "- 100 Point" : "실명 무료"}
        </Box>
      </Flex>
    </ModalLayout>
  );
}
export default GatherPickModal;
