import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";

import { Input } from "@/components/atoms/Input";
import { ModalLayout } from "@/components/modals/Modals";
import { NICKNAME_SET_POPUP } from "@/constants/keys/localStorage";
import { USER_INFO } from "@/constants/keys/queryKeys";
import { useUserInfoMutation } from "@/features/user/hooks/mutations";
import { useUserInfoQuery, useUserNicknamesQuery } from "@/features/user/hooks/queries";
import { validateNickname } from "@/features/user/lib/defaultNickname";
import { useToast } from "@/hooks/custom/CustomToast";
import { CloseProps } from "@/types/components/modalTypes";

// 가입 때 자동으로 붙은 기본 닉네임을 쓰는 회원에게 처음 한 번 닉네임을 정하게 한다.
function NicknameSetModal({ onClose }: CloseProps) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfoQuery();
  const { data: allNicknames } = useUserNicknamesQuery();

  const [value, setValue] = useState(userInfo?.nickname ?? "");
  const [errorMessage, setErrorMessage] = useState("");

  const finish = () => {
    localStorage.setItem(NICKNAME_SET_POPUP, userInfo?.uid ?? "");
    onClose();
  };

  const { mutate, isLoading } = useUserInfoMutation({
    onSuccess() {
      queryClient.invalidateQueries([USER_INFO]);
      toast("success", "닉네임이 설정되었습니다.");
      finish();
    },
    onError() {
      toast("error", "이미 사용 중이거나 사용할 수 없는 닉네임입니다.");
    },
  });

  const onSubmit = () => {
    const error = validateNickname(value, userInfo?.nickname, allNicknames);
    if (error) {
      setErrorMessage(error);
      return;
    }
    const nickname = value.trim();
    if (nickname === userInfo?.nickname) {
      finish();
      return;
    }
    mutate({ nickname });
  };

  return (
    <ModalLayout
      title="닉네임을 정해주세요"
      isCloseButton={false}
      isInputFocus
      footerOptions={{ main: { text: "확 인", func: onSubmit, isLoading } }}
      setIsModal={onClose}
    >
      <Box as="p" mb={3}>
        어바웃에서 사용할 닉네임이에요.
        <br />
        프로필에서 언제든 바꿀 수 있어요.
      </Box>
      <Input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setErrorMessage("");
        }}
        placeholder="닉네임 입력"
      />
      {errorMessage && (
        <Box mt={2} fontSize="12px" color="var(--color-red)" textAlign="left">
          {errorMessage}
        </Box>
      )}
    </ModalLayout>
  );
}

export default NicknameSetModal;
