/* eslint-disable */

import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import { useRecoilState } from "recoil";

import ImageUploadInput from "../../components/molecules/ImageUploadInput";

import { isGatherEditState } from "../../recoils/checkAtoms";
import { IModal } from "../../types/components/modalTypes";
import { IGather, IGatherWriting } from "../../types/models/gatherTypes/gatherTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IGatherWritingConfirmModal extends IModal {
  gatherData: Partial<IGatherWriting> | Partial<IGather>;
  createGather: ({ gather }: { gather: IGatherWriting }) => void;
  updateGather: ({ gather }: { gather: IGather }) => void;
  isEdit: boolean;
}

function GatherWritingConfirmModal({
  setIsModal,
  gatherData,
  createGather,
  updateGather,
  isEdit,
}: IGatherWritingConfirmModal) {
  const [isFirst, setIsFirst] = useState(true);
  const [imageUrl, setImageUrl] = useState();

  const [isGatherEdit, setIsGatherEdit] = useRecoilState(isGatherEditState);

  // const { data: gatherData2, isLoading } = useGatherQuery(0, null, "createdAt");

  const onSubmit = () => {
    if (!isGatherEdit) {
      createGather({ gather: gatherData as IGatherWriting });
    } else {
      updateGather({ gather: gatherData as IGather });
    }
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: isEdit ? "모임 수정" : isFirst ? "모임 개설" : "모임 개설",
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
                    mt="4px"
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

export default GatherWritingConfirmModal;
