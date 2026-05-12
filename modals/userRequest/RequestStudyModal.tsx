/* eslint-disable @typescript-eslint/no-explicit-any */

import { Box, Textarea } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

import { useFailToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IUserRequest } from "../../types/models/userTypes/userRequestTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IRequestSuggestModal extends IModal {
  title: string;
}

function RequestStudyModal({ title, setIsModal }: IRequestSuggestModal) {
  const toast = useToast();
  const failToast = useFailToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: sendDeclaration } = useUserRequestMutation({
    onSuccess() {
      toast("success", "완료되었습니다.");
      setIsModal(false);
    },
    onError(err) {
      console.error(err);
      failToast("error");
    },
  });

  const onValid = async (data) => {
    const declarationInfo: IUserRequest = {
      category: "건의",
      title: "카공 지도 관련",
      content: data.content,
      date: dayjs(),
    };

    await sendDeclaration(declarationInfo);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "제출",
      func: handleSubmit(onValid),
    },
    sub: {
      text: "취소",
    },
  };

  return (
    <ModalLayout title={title} setIsModal={setIsModal} footerOptions={footerOptions}>
      <Box as="form" onSubmit={handleSubmit(onValid)} id="declaration">
        <Box as="p" mb={2}>
          요청 내용을 작성해 주세요! <br />
          빠른 시간 내 반영하겠습니다.
        </Box>
        <Textarea
          autoFocus
          focusBorderColor="#00c2b3"
          {...register("content", {
            required: "내용을 입력해 주세요",
            minLength: {
              value: 5,
              message: "최소 5글자 이상 입력해 주세요",
            },
          })}
        />
        {errors.content && (
          <Box mt={4} fontSize="12px" color="red.400">
            {(errors as any).content.message}
          </Box>
        )}
      </Box>
    </ModalLayout>
  );
}

export default RequestStudyModal;
