/* eslint-disable */
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { RABBIT_RUN } from "../../../constants/keys/localStorage";
import { useUserRequestQuery } from "../../../hooks/admin/quries";
import { useCompleteToast, useErrorToast, useFailToast } from "../../../hooks/custom/CustomToast";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { useUserRequestMutation } from "../../../hooks/user/sub/request/mutations";
import { IModal } from "../../../types/components/modalTypes";
import { DispatchBoolean } from "../../../types/hooks/reactTypes";
import { IUserRequest } from "../../../types/models/userTypes/userRequestTypes";

interface IRegularGatherModal extends IModal {
  setIsRabbitRun: DispatchBoolean;
}

function RegularGatherModal({ setIsModal, setIsRabbitRun }: IRegularGatherModal) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const failToast = useFailToast();
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();
  const { data: userInfo } = useUserInfoQuery({ enabled: isGuest === false });
  const { data: requestData, isLoading } = useUserRequestQuery("조모임");

  const { mutate } = useUserRequestMutation({
    onSuccess() {
      completeToast("apply");
      setIsModal(false);
    },
    onError: errorToast,
  });

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (!localStorage.getItem(RABBIT_RUN)) {
      setIsRabbitRun(false);
      localStorage.setItem(RABBIT_RUN, "read");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onValid = (data) => {
    if (isGuest) {
      failToast("guest");
      return;
    }
    /**종료 */
    failToast("free", "신청이 마감되었습니다.");
    return;
    const applyData: IUserRequest = {
      category: "조모임",
      title: userInfo.birth + "-" + userInfo.mbti,
      content: data?.content || "",
    };

    mutate(applyData);
  };
  return null;
  // <ModalLayout onClose={() => setIsModal(false)} size="xl">
  //   <ModalHeader text="조모임 참여 신청서" />
  //   <ModalBody>
  //     <Overview>
  //       이번 달에는 개강을 맞아 같은 동네의 또래 친구들을 만날 수 있는
  //       조모임으로 진행합니다!
  //       <Count>
  //         <span>전체 신청 인원:</span>
  //         <span>{isLoading ? "..." : requestData?.length}명</span>
  //       </Count>
  //       <Rule>
  //         <li>조 인원은 4~6명 사이로 구성됩니다.</li>
  //         <li>나이는 동갑에서 최대 2살 이내로 구성됩니다.</li>
  //         <li>요구사항이 있는 경우 적어주시면 맞춰서 조를 짜드려요!</li>
  //         <li>활동 날짜나 내용은 조장이 알아서 조율 !</li>
  //       </Rule>
  //     </Overview>
  //     <Form onSubmit={handleSubmit(onValid)} id="declaration">
  //       <Item>
  //         <span>신청 마감:</span>
  //         <div>9월 10일</div>
  //       </Item>
  //       <Item>
  //         <Content>
  //           <span>요구 사항:</span>
  //           <span>(있는 경우)</span>
  //         </Content>
  //         <ContentInput {...register("content")} />
  //       </Item>
  //     </Form>
  //   </ModalBody>

  //   <ModalFooter p="var(--gap-3) var(--gap-4)">
  //     <Button
  //       w="100%"
  //       size="lg"
  //       type="button"
  //       onClick={() => setIsModal(false)}
  //     >
  //       취소
  //     </Button>
  //     <Button
  //       w="100%"
  //       colorScheme="mint"
  //       form="declaration"
  //       type="submit"
  //       size="lg"
  //     >
  //       신청
  //     </Button>
  //   </ModalFooter>
  // </ModalLayout>
}

const Overview = styled.div`
  color: var(--gray-800);
`;

const Count = styled.div`
  color: var(--gray-800);
  width: max-content;
  padding: var(--gap-1) var(--gap-2);
  border-radius: var(--rounded-lg);
  border: var(--border-mint);
  margin: var(--gap-3) 0;
  font-size: 13px;
  > span:last-child {
    margin-left: var(--gap-2);
    color: var(--color-mint);
    font-weight: 600;
  }
`;

const Rule = styled.div`
  color: var(--gray-600);
  margin-top: var(--gap-2);

  font-size: 11px;
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  margin-top: var(--gap-2);
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
  margin-bottom: var(--gap-2);
  align-items: center;

  > span {
    display: inline-block;
    min-width: 23%;
    font-weight: 600;
  }
  > input {
    height: 90%;
    flex: 1;
  }
`;

const Content = styled.div`
  min-width: 23%;
  display: flex;
  flex-direction: column;

  height: 100%;
  > span:first-child {
    font-weight: 600;
  }
  > span:last-child {
    font-size: 11px;
    color: var(--gray-600);
  }
`;

const ContentInput = styled.textarea`
  border-radius: var(--rounded-lg);
  display: block;
  width: 100%;
  font-size: 12px;
  height: 100%;
  background-color: var(--input-bg);
  padding: var(--gap-1);
  :focus {
    outline: none;
  }
`;

export default RegularGatherModal;
