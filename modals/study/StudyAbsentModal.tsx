import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import Textarea from "../../components/atoms/Textarea";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useRealTimeAbsenceMutation } from "../../hooks/realtime/mutations";
import { useStudyAbsenceMutation } from "../../hooks/study/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { IModal } from "../../types/components/modalTypes";
import { getTodayStr } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

interface StudyAbsentModalProps extends IModal {
  type: "study" | "realTimes";
}

function StudyAbsentModal({ type, setIsModal }: StudyAbsentModalProps) {
  const typeToast = useTypeToast();
  const resetStudy = useResetStudyQuery();

  const [value, setValue] = useState<string>("");

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: sendRequest } = useUserRequestMutation();

  const { mutate: absentRealTimes, isLoading: isLoading1 } = useRealTimeAbsenceMutation(
    getTodayStr(),
    {
      onSuccess() {
        handleSuccess();
      },
    },
  );

  const { mutate: absentStudy, isLoading: isLoading2 } = useStudyAbsenceMutation(getTodayStr(), {
    onSuccess: () => {
      handleSuccess();
    },
  });

  const handleSuccess = () => {
    typeToast("cancel");
    resetStudy();
    sendRequest({
      title: userInfo.name,
      category: "불참",
      content: value,
    });
    setIsModal(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "불참",
      func: () => {
        if (type === "study") absentStudy({ message: value });
        else absentRealTimes();
      },
      isLoading: isLoading1 || isLoading2,
    },
    sub: {
      text: "취소",
    },
    colorType: "red",
  };

  return (
    <>
      <ModalLayout title="당일 불참" footerOptions={footerOptions} setIsModal={setIsModal}>
        <>
          <Box as="p" mb={3}>
            {dayjs().hour() >= 13 ? (
              <>
                당일 노쇼로 벌금{" "}
                <Box as="b" color="red">
                  1,000원
                </Box>
                이 발생합니다.
                <br /> 참여 시간을 변경해 보는 건 어떨까요?
              </>
            ) : (
              <>
                당일 불참으로 벌금{" "}
                <Box as="b" color="red">
                  500원
                </Box>
                이 발생합니다.
                <br /> 참여 시간을 변경해 보는 건 어떨까요?
              </>
            )}
          </Box>
          <Box w="full">
            <Textarea
              minH="80px"
              value={value}
              placeholder="불참 사유를 적어주시면, 벌금이 완화될 수 있습니다."
              onChange={(e) => setValue(e.target.value)}
              _focus={{
                boxShadow: "0 0 0 1px var(--color-red)",
                borderColor: "var(--color-red)",
              }}
              _hover={{
                boxShadow: "0 0 0 1px var(--color-red)",
                borderColor: "var(--color-red)",
              }}
            />
          </Box>
        </>
      </ModalLayout>
    </>
  );
}

export default StudyAbsentModal;
