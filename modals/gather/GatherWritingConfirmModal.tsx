/* eslint-disable */

import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import ImageUploadInput from "../../components/molecules/ImageUploadInput";

import { isGatherEditState } from "../../recoils/checkAtoms";
import { sharedGatherWritingState } from "../../recoils/sharedDataAtoms";
import { IModal } from "../../types/components/modalTypes";
import { IGather, IGatherWriting } from "../../types/models/gatherTypes/gatherTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IGatherWritingConfirmModal extends IModal {
  gatherData: Partial<IGatherWriting> | Partial<IGather>;
  createGather: ({ gather }: { gather: IGatherWriting }) => void;
  updateGather: ({ gather }: { gather: IGather }) => void;
}

function GatherWritingConfirmModal({
  setIsModal,
  gatherData,
  createGather,
  updateGather,
}: IGatherWritingConfirmModal) {
  const [isFirst, setIsFirst] = useState(true);
  const [imageUrl, setImageUrl] = useState();

  const [isGatherEdit, setIsGatherEdit] = useRecoilState(isGatherEditState);

  // const { data: gatherData2, isLoading } = useGatherQuery(0, null, "createdAt");
  const setGatherContent = useSetRecoilState(sharedGatherWritingState);

  const onSubmit = () => {
    console.log(12, gatherData);

    if (!isGatherEdit) {
      createGather({ gather: gatherData as IGatherWriting });
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
              <Flex flexDir="column" lineHeight={2.2}>
                <Flex>
                  <Box fontWeight="semibold" mr={2}>
                    제목:
                  </Box>
                  <Box
                    textAlign="start"
                    flex={1}
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    {gatherData?.title}
                  </Box>
                </Flex>
                <Flex>
                  <Box fontWeight="semibold" mr={2}>
                    날짜:
                  </Box>
                  <Box
                    textAlign="start"
                    flex={1}
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                  >
                    {dayjs(gatherData.date).format("M월 D일, H시 mm분")}
                  </Box>
                </Flex>
                <Flex>
                  <Box fontWeight="semibold" mr={2}>
                    내용:
                  </Box>
                  <Box
                    mt="5px"
                    alignSelf="flex-end"
                    textAlign="start"
                    lineHeight={1.5}
                    flex={1}
                    overflow="hidden"
                    display="-webkit-box"
                    sx={{
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {gatherData.content}
                  </Box>
                </Flex>
              </Flex>
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
