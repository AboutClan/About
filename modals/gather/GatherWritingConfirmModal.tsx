/* eslint-disable */

import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import ImageUploadInput from "../../components/molecules/ImageUploadInput";
import { GATHER_CONTENT } from "../../constants/keys/queryKeys";

import { useErrorToast, useToast } from "../../hooks/custom/CustomToast";
import { useGatherWritingMutation } from "../../hooks/gather/mutations";
import { useGatherQuery } from "../../hooks/gather/queries";
import { isGatherEditState } from "../../recoils/checkAtoms";
import { sharedGatherWritingState } from "../../recoils/sharedDataAtoms";
import { IModal } from "../../types/components/modalTypes";
import { IGather, IGatherWriting } from "../../types/models/gatherTypes/gatherTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IGatherWritingConfirmModal extends IModal {
  gatherData: IGatherWriting | IGather;
}

function GatherWritingConfirmModal({ setIsModal, gatherData }: IGatherWritingConfirmModal) {
  const router = useRouter();
  const errorToast = useErrorToast();
  const queryClient = useQueryClient();
  const toast = useToast();
  console.log(gatherData);
  const [isFirst, setIsFirst] = useState(true);
  const [imageUrl, setImageUrl] = useState();

  const [isGatherEdit, setIsGatherEdit] = useRecoilState(isGatherEditState);

  const { data: gatherData2, isLoading } = useGatherQuery(0, null, "createdAt");
  const setGatherContent = useSetRecoilState(sharedGatherWritingState);

  const { mutate } = useGatherWritingMutation("post", {
    onSuccess(data) {
      queryClient.refetchQueries({ queryKey: [GATHER_CONTENT], exact: false });
      setGatherContent(null);
      router.push(`/gather/${(data as unknown as { gatherId: number })?.gatherId}`);
      toast("success", "모임이 등록되었어요!");
    },
    onError: errorToast,
  });
  const { mutate: updateGather } = useGatherWritingMutation("patch", {
    onSuccess() {
      queryClient.refetchQueries({ queryKey: [GATHER_CONTENT], exact: false });
      setGatherContent(null);
      router.push(`/gather/${(gatherData as IGather).id}`);
      toast("success", "내용이 변경되었어요!");
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
            <Box mb={5}>
              {isFirst ? "개설 내용을 확인해 주세요!" : "선택사항. 기본 랜덤 이미지로 설정됩니다."}
            </Box>
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
    </>
  );
}

const Container = styled.div`
  line-height: 2;
  font-size: 13px;
  text-align: start;
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  > span:first-child {
    display: inline-block;
    width: 32px;
    text-align: start;
    font-weight: 600;
    margin-right: var(--gap-2);
  }
  > span:last-child {
    flex: 1;
    text-align: start;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default GatherWritingConfirmModal;
