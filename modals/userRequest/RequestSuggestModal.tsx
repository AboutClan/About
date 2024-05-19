import {
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Textarea,
} from "@chakra-ui/react";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { useCompleteToast, useFailToast } from "../../hooks/custom/CustomToast";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IUserRequest } from "../../types/models/userTypes/userRequestTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IRequestSuggestModal extends IModal {
  type: "suggest" | "declare" | "study";
}

function RequestSuggestModal({ type, setIsModal }: IRequestSuggestModal) {
  const { data: session } = useSession();
  const failToast = useFailToast();
  const completeToast = useCompleteToast();

  const [isRealName, setIsRealName] = useState(true);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: type === "study" ? "스터디 장소 추천" : "",
      content: "",
    },
  });

  const location = session?.user.location;

  const { mutate } = usePointSystemMutation("point", {
    onSuccess() {
      completeToast("free", "제출 완료! 10 point 획득!");
      setIsModal(false);
    },
  });

  const { mutate: sendDeclaration } = useUserRequestMutation({
    onSuccess() {},
    onError(err) {
      console.error(err);
      failToast("error");
    },
  });

  const onValid = async (data) => {
    const declarationInfo: IUserRequest = {
      category: type === "suggest" ? "건의" : "신고",
      title: data.title,
      writer: isRealName ? session.user.name : "",
      content: data.content,
      date: dayjs(),
      location,
    };

    await sendDeclaration(declarationInfo);
    await mutate({ value: 10, message: "스터디 장소 추천" });
  };

  const title =
    type === "suggest" ? "건의하기" : type === "declare" ? "불편사항 신고" : "스터디 장소 추천";

  const footerOptions: IFooterOptions = {
    main: {
      text: "제출",
      func: handleSubmit(onValid),
    },
    sub: {
      text: "취소",
    },
    isFull: false,
  };

  return (
    <ModalLayout title={title} setIsModal={setIsModal} footerOptions={footerOptions}>
      <Form onSubmit={handleSubmit(onValid)} id="declaration">
        <Item>
          <span>제목: </span>
          <Input size="sm" {...register("title")} focusBorderColor="#00c2b3" />
        </Item>
        <Item>
          <span>작성일:</span>
          <div>{dayjs().format("YYYY-MM-DD")}</div>
        </Item>
        {type !== "study" && (
          <Item>
            <span>작성자: </span>
            <Writer>
              <WriterBtn type="button" isSelected={isRealName} onClick={() => setIsRealName(true)}>
                실명
              </WriterBtn>
              <WriterBtn
                type="button"
                isSelected={!isRealName}
                onClick={() => setIsRealName(false)}
              >
                익명
              </WriterBtn>
              <div />
              <Popover>
                <PopoverTrigger>
                  <FontAwesomeIcon icon={faCircleExclamation} color="var(--gray-2)" size="sm" />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader fontSize="11px">익명 제출</PopoverHeader>
                  <PopoverBody fontSize="11px">
                    익명으로 제출한 건의/문의/불만 등에 대해서는 철저하게 익명을 보장합니다. 단,
                    채택되어도 상품을 받을 수 없습니다.
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Writer>
          </Item>
        )}
        <Item>
          <Content>내용:</Content>
          <Textarea {...register("content")} focusBorderColor="#00c2b3" />
        </Item>
      </Form>
      {type === "study" && (
        <Item
          style={{
            color: "var(--gray-700)",
            marginTop: "var(--gap-1)",
            marginBottom: "0",
          }}
        >
          ※ 활동 지역을 벗어나는 곳은 채택이 어려워요.
        </Item>
      )}
    </ModalLayout>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  > div:last-child {
    flex: 1;
  }
`;

const Item = styled.div`
  display: flex;
  min-height: 28px;
  margin-bottom: var(--gap-3);
  align-items: center;
  > span {
    display: inline-block;
    min-width: 20%;
    font-weight: 600;
  }
`;

const Writer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  > button:last-child {
    margin-right: var(--gap-3);
  }
  > div {
    width: 12px;
  }
`;
const WriterBtn = styled.button<{ isSelected: boolean }>`
  font-size: 12px;
  width: 36px;

  height: 80%;
  background-color: ${(props) => (props.isSelected ? "var(--color-mint)" : "var(--gray-300)")};
  color: ${(props) => (props.isSelected ? "white" : "var(--gray-900)")};
`;

const Content = styled.span`
  margin-bottom: auto;
`;

export default RequestSuggestModal;
