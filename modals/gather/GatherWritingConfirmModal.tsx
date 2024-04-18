/* eslint-disable */

import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import SuccessScreen from "../../components/layouts/SuccessScreen";
import ImageUploadInput from "../../components/molecules/ImageUploadInput";
import { GATHER_CONTENT } from "../../constants/keys/queryKeys";
import { useResetQueryData } from "../../hooks/custom/CustomHooks";
import { useErrorToast } from "../../hooks/custom/CustomToast";
import { useGatherWritingMutation } from "../../hooks/gather/mutations";
import { isGatherEditState } from "../../recoils/checkAtoms";
import { sharedGatherWritingState } from "../../recoils/sharedDataAtoms";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IGather, IGatherWriting } from "../../types/models/gatherTypes/gatherTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IGatherWritingConfirmModal extends IModal {
  gatherData: IGatherWriting | IGather;
}

function GatherWritingConfirmModal({ setIsModal, gatherData }: IGatherWritingConfirmModal) {
  const router = useRouter();
  const errorToast = useErrorToast();

  const [isFirst, setIsFirst] = useState(true);
  const [imageUrl, setImageUrl] = useState();
  const [isSuccessScreen, setIsSuccessScreen] = useState(false);
  const [isGatherEdit, setIsGatherEdit] = useRecoilState(isGatherEditState);
  const resetQueryData = useResetQueryData();
  const setGatherContent = useSetRecoilState(sharedGatherWritingState);

  const { mutate } = useGatherWritingMutation("post", {
    onSuccess() {
      resetQueryData([GATHER_CONTENT]);
      setTimeout(() => {
        setGatherContent(null);
      }, 200);
      setIsSuccessScreen(true);
    },
    onError: errorToast,
  });
  const { mutate: updateGather } = useGatherWritingMutation("patch", {
    onSuccess() {
      resetQueryData([GATHER_CONTENT]);
      setTimeout(() => {
        setGatherContent(null);
        router.push(`/gather/${(gatherData as IGather).id}`);
      }, 400);
    },
    onError: errorToast,
  });

  const onSubmit = () => {
    if (!isGatherEdit) {
      mutate({ gather: gatherData as IGatherWriting });
    } else {
      updateGather({ gather: gatherData as IGather });
    }
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: isGatherEdit ? "모임 수정" : isFirst ? "모임 개설" : "모임 개설",
      func: isFirst ? onSubmit : onSubmit,
    },
  };

  return (
    <>
      {gatherData && (
        <ModalLayout
          title={isGatherEdit ? "모임 수정" : "모임 개설"}
          setIsModal={setIsModal}
          footerOptions={footerOptions}
        >
          <>
            <ModalSubtitle>
              {isFirst ? "개설 내용을 확인해 주세요!" : "선택사항. 기본 랜덤 이미지로 설정됩니다."}
            </ModalSubtitle>
            {isFirst ? (
              <Container>
                <Item>
                  <span>제목:</span>
                  <span>{gatherData?.title}</span>
                </Item>
                <Item>
                  <span>날짜:</span>
                  <span>{dayjs(gatherData.date).format("M월 D일, H시 m분")}</span>
                </Item>
                <Item>
                  <span>주제:</span>
                  <span>{gatherData.type.subtitle || "기타"}</span>
                </Item>
              </Container>
            ) : (
              <>
                <ImageUploadInput setImageUrl={setImageUrl} />
              </>
            )}
          </>
        </ModalLayout>
      )}
      {isSuccessScreen && (
        <SuccessScreen url="/gather">
          <>
            <span>모임 개최 성공</span>
            <div>모임 게시글을 단톡방에 공유해 주세요!</div>
          </>
        </SuccessScreen>
      )}
    </>
  );
}

const Container = styled.div`
  line-height: 2;
  font-size: 13px;
  color: var(--gray-2);
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  > span:first-child {
    display: inline-block;
    width: 32px;
    font-weight: 600;
    margin-right: var(--gap-2);
  }
  > span:last-child {
    flex: 1;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default GatherWritingConfirmModal;
