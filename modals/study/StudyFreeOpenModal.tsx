import dayjs from "dayjs";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  ModalFooterTwo,
  ModalHeaderX,
} from "../../components/common/modal/ModalComponents";
import { ModalLayout } from "../../components/common/modal/Modals";
import { useCompleteToast, useErrorToast } from "../../hooks/CustomToast";
import { useStudyOpenFreeMutation } from "../../hooks/study/mutations";
import { ModalMain } from "../../styles/layout/modal";

function StudyFreeOpenModal({ setIsModal }) {
  const router = useRouter();
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();
  const voteDate = dayjs(router.query.date as string);
  const placeId = router.query.placeId;
  const { mutate: openFree } = useStudyOpenFreeMutation(voteDate, {
    onSuccess() {
      completeToast("free", "스터디가 Free로 오픈되었습니다.");
      setIsModal(false);
    },
    onError: errorToast,
  });
  return (
    <ModalLayout size="sm">
      <ModalHeaderX title="Free 오픈 신청" setIsModal={setIsModal} />
      <ModalMain>
        규칙에 상관없이 자유롭게 참여할 수 있고, 스터디 출석 리워드도 그대로
        받을 수 있습니다.
      </ModalMain>
      <ModalFooterTwo
        right="오픈"
        setIsModal={setIsModal}
        onSubmit={() => openFree(placeId as string)}
      />
    </ModalLayout>
  );
}

const Layout = styled.div``;

const Footer = styled.div``;

export default StudyFreeOpenModal;