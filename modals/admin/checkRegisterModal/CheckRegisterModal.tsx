import { useDisclosure } from "@chakra-ui/react";
import styled from "styled-components";

import { CopyBtn } from "../../../components/Icons/CopyIcon";
import { useErrorToast, useToast } from "../../../hooks/custom/CustomToast";
import { useUserRegisterControlMutation } from "../../../hooks/user/mutations";
import { IModal } from "../../../types/components/modalTypes";
import { IRefetch } from "../../../types/hooks/reactTypes";
import { IUserRegisterForm } from "../../../types/models/userTypes/userInfoTypes";
import AlertDialog from "../../AlertDialog";
import { IFooterOptions, ModalLayout } from "../../Modals";

interface ICheckRegisterModal extends IModal, IRefetch {
  applicant: IUserRegisterForm;
}

function CheckRegisterModal({ setIsModal, applicant, setIsRefetch }: ICheckRegisterModal) {
  const toast = useToast();
  const errorToast = useErrorToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const uid = applicant?.uid;

  const { mutate: approve } = useUserRegisterControlMutation("post", {
    onSuccess() {
      toast("success", "가입이 승인되었습니다.");
    },
    onError: errorToast,
  });

  const { mutate: deleteForm } = useUserRegisterControlMutation("delete", {
    onSuccess() {
      toast("success", "가입이 거절되었습니다.");
    },
    onError: errorToast,
  });

  const onClickAgree = () => {
    approve(uid);
    setIsRefetch(true);
    setIsModal(false);
  };

  const onClickDelete = () => {
    onClose();
    deleteForm(uid);
    setIsModal(false);
    setIsRefetch(true);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "승인",
      func: onClickAgree,
    },
    sub: {
      text: "거절",
      func: onOpen,
    },
  };

  return (
    <>
      <ModalLayout
        title={applicant.name || "정보 없음"}
        setIsModal={setIsModal}
        footerOptions={footerOptions}
      >
        <Item>
          <b>성별 </b>
          {applicant?.gender}
        </Item>
        <Item>
          <b>지역 </b>
          {applicant?.location}
        </Item>
        <Item>
          <b>나이 </b>
          {applicant?.birth}
        </Item>
        <Item>
          <b>mbti </b>
          {applicant?.mbti}
        </Item>
        <Item>
          <b>전공 </b>
          {applicant?.majors[0]?.detail}
        </Item>
        <Item>
          <b>상세 지역 </b>
          {applicant?.locationDetail?.text}
        </Item>
        <Item>
          <b>연락처 </b>
          {applicant?.telephone}
          <IconWrapper>
            <CopyBtn text={applicant?.telephone} />
          </IconWrapper>
        </Item>
      </ModalLayout>
      <AlertDialog isOpen={isOpen} onClose={onClose} onSubmit={onClickDelete} />
    </>
  );
}

export default CheckRegisterModal;

const Item = styled.div`
  font-size: 14px;
  margin-bottom: var(--gap-2);
  > b {
    display: inline-block;
    width: 64px;
  }
`;
const IconWrapper = styled.span`
  margin-left: var(--gap-2);
`;
