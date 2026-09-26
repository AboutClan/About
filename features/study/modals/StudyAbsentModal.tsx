import { Box } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useState } from "react";

import Textarea from "@/components/atoms/Textarea";
import { IFooterOptions, ModalLayout } from "@/components/modals/Modals";
import {
  getStudyAbsencePoint,
  REALTIME_ABSENCE_POINT,
  STUDY_ABSENCE_HOURLY,
  STUDY_ABSENCE_MAX,
} from "@/constants/serviceConstants/studyConstants/studyAbsenceConstant";
import { useStudyAbsenceMutation } from "@/features/study/hooks/mutations";
import { useResetStudyQuery } from "@/features/study/hooks/useResetStudyQuery";
import { useUserInfoQuery } from "@/features/user/hooks/queries";
import { useUserRequestMutation } from "@/features/user/hooks/sub/request/mutations";
import { useToast, useTypeToast } from "@/hooks/custom/CustomToast";
import { useRealTimeAbsenceMutation } from "@/hooks/realtime/mutations";
import { IModal } from "@/types/components/modalTypes";
import { getTodayStr } from "@/utils/dateTimeUtils";

interface StudyAbsentModalProps extends IModal {
  type: "study" | "realTimes";
}

function StudyAbsentModal({ type, setIsModal }: StudyAbsentModalProps) {
  const typeToast = useTypeToast();
  const toast = useToast();
  const resetStudy = useResetStudyQuery();

  const [value, setValue] = useState<string>("");

  // 자동 매칭은 결과 확정 후 시간이 지날수록 벌금이 오르고, realtime은 고정이다.
  const absencePoint = type === "study" ? getStudyAbsencePoint() : REALTIME_ABSENCE_POINT;
  const willIncrease = type === "study" && absencePoint < STUDY_ABSENCE_MAX;

  const { data: userInfo } = useUserInfoQuery();

  const { mutate: sendRequest } = useUserRequestMutation();

  // 서버가 400으로 거절하는 경우(확정 스터디 없음 / 이미 불참 처리됨)가 있어
  // onError가 없으면 버튼만 멈추고 아무 안내도 뜨지 않는다.
  const handleError = (err: AxiosError) => {
    console.error(err);
    const message = (err?.response?.data as { message?: string })?.message;
    toast("error", message || "불참 처리에 실패했어요. 잠시 후 다시 시도해 주세요.");
    setIsModal(false);
  };

  const { mutate: absentRealTimes, isLoading: isLoading1 } = useRealTimeAbsenceMutation(
    getTodayStr(),
    {
      onSuccess() {
        handleSuccess();
      },
      onError: handleError,
    },
  );

  const { mutate: absentStudy, isLoading: isLoading2 } = useStudyAbsenceMutation(getTodayStr(), {
    onSuccess: () => {
      handleSuccess();
    },
    onError: handleError,
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
        else absentRealTimes({ message: value });
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
            당일 불참으로 벌금{" "}
            <Box as="b" color="red">
              {absencePoint.toLocaleString()}P
            </Box>
            가 차감됩니다.
            {willIncrease && (
              <>
                <br />
                한 시간마다 {STUDY_ABSENCE_HOURLY}P씩 올라가니 늦기 전에 알려주세요.
              </>
            )}
            <br /> 참여 시간을 변경해 보는 건 어떨까요?
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
