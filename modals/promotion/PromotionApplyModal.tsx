import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";

import { useCompleteToast } from "../../hooks/custom/CustomToast";
import { usePromotionMutation } from "../../hooks/sub/promotion/mutations";
import { usePromotionQuery } from "../../hooks/sub/promotion/queries";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalFooterOne, ModalFooterTwo, ModalLayout } from "../Modals";

interface IPromotionApplyModal extends IModal {
  uniName: string;
}

function PromotionApplyModal({ setIsModal, uniName }: IPromotionApplyModal) {
  const { data: session } = useSession();
  const completeToast = useCompleteToast();

  const [contentType, setContentType] = useState<"cool" | "none">();
  const [coolTime, setCoolTime] = useState<number>();

  const { data } = usePromotionQuery();

  const queryClient = useQueryClient();

  const { mutate } = usePromotionMutation({
    onSuccess() {
      queryClient.invalidateQueries("promotion");
      completeToast("free", "포인트 지급 완료! 감사합니다!");
      setIsModal(false);
    },
  });
  const { mutate: sendRequest } = useUserRequestMutation();

  const onSubmit = () => {
    const findUni = data?.find((item) => item.name === uniName);
    if (!findUni) setContentType("none");
    else {
      const diff = dayjs(findUni.lastDate).add(3, "day").subtract(9, "hours").diff(dayjs(), "hour");

      if (diff <= 0) mutate(uniName);
      else {
        setContentType("cool");
        setCoolTime(diff);
      }
    }
  };

  const handleApply = () => {
    sendRequest({ category: "홍보", writer: session.user.name });
    mutate(uniName);
  };
  <>
    {!contentType ? (
      <ModalFooterTwo
        leftText="다음에"
        rightText="게시완료"
        onClickLeft={() => setIsModal(false)}
        onClickRight={onSubmit}
        isFull={true}
      />
    ) : contentType === "cool" ? (
      <ModalFooterOne text="확인" onClick={() => setIsModal(false)} />
    ) : (
      <ModalFooterTwo
        leftText="다음에"
        rightText="확인"
        onClickLeft={() => setIsModal(false)}
        onClickRight={handleApply}
        isFull={true}
      />
    )}
  </>;

  const footerOptions: IFooterOptions = {
    main: {
      text:
        contentType === "none" || !contentType
          ? "게시완료"
          : contentType === "cool"
            ? "확인"
            : "다음에",
      func: !contentType
        ? onSubmit
        : contentType === "cool"
          ? () => setIsModal(false)
          : handleApply,
    },

    ...(!contentType
      ? {
          sub: {
            text: "다음에",
          },
        }
      : contentType === "cool"
        ? undefined
        : {
            sub: {
              text: "다음에",
            },
          }),
  };

  return (
    <ModalLayout footerOptions={footerOptions} setIsModal={setIsModal} title="이벤트 보상 신청">
      <ModalSubtitle>
        {!contentType ? (
          <>
            홍보글을 작성해 주셨나요? <b> +100 Point</b>와 추첨을 통해 치킨 기프티콘을 드려요!
          </>
        ) : contentType === "cool" ? (
          <>
            아직 신청 쿨타임이 지나지 않았어요!
            <br />
            쿨타임이 끝난 뒤에 다시 신청해주세요!
          </>
        ) : (
          <>
            처음 홍보를 진행하는 대학교예요! 대학교 목록에 {uniName}를 추가 후 진행할게요! 최초
            등록시 +300 point가 지급됩니다.
          </>
        )}
      </ModalSubtitle>
      {!contentType ? (
        <Uni>
          <span>학교:</span>
          <span>{uniName}</span>
        </Uni>
      ) : (
        contentType === "cool" && (
          <CoolTime>
            <i className="fa-regular fa-clock" />
            <span>
              {coolTime >= 24 ? Math.ceil(coolTime / 24) : coolTime}{" "}
              {coolTime >= 24 ? "일" : "시간"}
            </span>
          </CoolTime>
        )
      )}
    </ModalLayout>
  );
}

const Uni = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: 600;
  > span:last-child {
    margin-left: var(--gap-1);
    color: var(--color-mint);
  }
`;

const CoolTime = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: var(--border-mint);
  border-radius: var(--rounded-lg);
  color: var(--color-mint);
  font-weight: 600;
  font-size: 14px;
  > span {
    margin-left: var(--gap-2);
  }
`;

export default PromotionApplyModal;
