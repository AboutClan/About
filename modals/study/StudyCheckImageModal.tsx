import { faCameraViewfinder } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IFooterOptions, ModalLayout } from "../../components/modals/Modals";
import { POINT_SYSTEM_PLUS } from "../../constants/settingValue/pointSystem";
import { now } from "../../helpers/dateHelpers";
import { getRandomAlphabet } from "../../helpers/eventHelpers";
import {
  useCompleteToast,
  useErrorToast,
  useFailToast,
} from "../../hooks/custom/CustomToast";
import { useStudyAttendCheckMutation } from "../../hooks/study/mutations";
import { useImageUploadMutation } from "../../hooks/sub/utilMutations";
import { useAboutPointMutation } from "../../hooks/user/mutations";
import { useAlphabetMutation } from "../../hooks/user/sub/collection/mutations";

import { isRefetchstudyState } from "../../recoil/refetchingAtoms";
import { transferAlphabetState } from "../../recoil/transferDataAtoms";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/reactTypes";

function StudyCheckImageModal({ setIsModal }: IModal) {
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();
  const failToast = useFailToast();

  const setIsRefetchstudy = useSetRecoilState(isRefetchstudyState);
  const setTransferAlphabetState = useSetRecoilState(transferAlphabetState);

  const { mutate: getAboutPoint } = useAboutPointMutation();
  const { mutate: getAlphabet } = useAlphabetMutation("get");
  const { mutate: handleArrived } = useStudyAttendCheckMutation(
    now().startOf("day"),
    {
      onSuccess() {
        const alphabet = getRandomAlphabet(20);
        if (alphabet) {
          getAlphabet({ alphabet });
          setTransferAlphabetState(alphabet);
        }
        getAboutPoint(POINT_SYSTEM_PLUS.STUDY_PRIVATE_ATTEND);
        completeToast("free", "출석 완료 !");
        setIsRefetchstudy(true);
        setIsModal(false);
      },
      onError: errorToast,
    }
  );





  const { mutate, data } = useImageUploadMutation({
    onSuccess() {},
  });

  const onSubmit = async () => {
    if (!imageSrc) {
      failToast("free", "인증 사진을 첨부해주세요!");
      return;
    }
    handleArrived(null);
    return;
    // const response = await fetch(imageSrc);

    // const blob = await response.blob();

    // const file = new File([blob], "스터디 인증 사진 테스트", {
    //   type: blob.type,
    // });
    // // FormData 객체 생성

    // const formData = new FormData();
    // formData.append("image", file); // 'image'는 서버에서 파일을 참조하는 키입니다.
    // mutate(formData);
    // 서버로 POST 요청 보내기

    // fetch(`${SERVER_URI}/image/upload`, {
    //   method: "POST",
    //   body: null,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //
    //     // 여기서 성공 메시지 등 처리
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     // 여기서 에러 처리
    //   });

    // const blob = await response.blob();
    // const file = new File([blob], "image.jpg", { type: blob.type });
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "출석",
      func: onSubmit,
    },
  };

  return (
    <ModalLayout
      title="출석 체크"
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
      <ModalSubtitle>참여를 인증할 수 있는 사진을 올려주세요!</ModalSubtitle>
     
    </ModalLayout>
  );
}

const Input = styled.input`
  display: none;
`;



export default StudyCheckImageModal;
