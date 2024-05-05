/* eslint-disable */
import styled from "styled-components";

import { useAdminDepositMutation } from "../../hooks/admin/mutation";
import { useCompleteToast, useErrorToast } from "../../hooks/custom/CustomToast";
import { IModal } from "../../types/components/modalTypes";

interface ICheckAbsentModal extends IModal {
  uid: string;
  fee: number;
}

function CheckAbsentModal({ uid, fee, setIsModal }: ICheckAbsentModal) {
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();

  const { mutate } = useAdminDepositMutation(uid, {
    onSuccess() {
      completeToast("free", "성공적으로 처리되었습니다. 중복해서 처리하지 않도록 주의해주세요!");
      setIsModal(false);
    },
    onError: errorToast,
  });

  const onClick = () => {
    mutate({ value: fee, message: "불참 인정으로 인한 벌금 면제" });
  };

  return (
    // <ModalLayout onClose={() => setIsModal(false)} size="md" height={180}>
    //   <ModalHeader text="불참 인정" />
    //   <ModalBody>
    //     해당 유저의 불참을 인정합니다. 벌금이 면제됩니다. 남용하지는 말아주세요!
    //   </ModalBody>
    //   <ModalFooterTwo
    //     leftText="닫기"
    //     rightText="인정"
    //     onClickLeft={() => setIsModal(false)}
    //     onClickRight={onClick}
    //   />
    // </ModalLayout>
    null
  );
}

const Layout = styled.div``;

export default CheckAbsentModal;
