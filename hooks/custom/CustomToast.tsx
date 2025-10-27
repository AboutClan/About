import { useToast as useChakraToast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useCallback } from "react";

export type FailToast =
  | "free"
  | "guest"
  | "loadStudy"
  | "studyVote"
  | "apply"
  | "error"
  | "time"
  | "warning";

export const useToast = () => {
  const toast = useChakraToast();

  const showToast = useCallback(
    (status: "success" | "error" | "warning" | "info", title: string, duration: number = 3000) => {
      toast({
        title: title,
        status,
        duration: duration,
        variant: "subtle",
        colorScheme: status === "success" ? "mint" : undefined,
        containerStyle: {
          marginBottom: "76px",
        },
      });
    },
    [toast],
  );

  return showToast;
};

type ToastType =
  | "guest"
  | "cancel"
  | "error"
  | "change"
  | "invite"
  | "inspection"
  | "participate"
  | "apply"
  | "not-yet"
  | "register"
  | "empty";

type ToastConfig = {
  title: string;
  status?: "success" | "error" | "warning" | "info";
  subTitle?: string;
  colorScheme?: "mint";
};

const TOAST_MAP: Record<ToastType, ToastConfig> = {
  apply: { title: "신청 완료!" },
  cancel: { title: "취소 완료" },
  change: { title: "변경 완료" },
  invite: { title: "초대 완료" },
  participate: { title: "참여가 완료되었습니다." },
  register: { title: "등록 완료" },
  "not-yet": { title: "개발중인 기능입니다.", status: "info" },

  inspection: {
    title: "점검중인 기능입니다.",
    status: "info",
  },
  guest: {
    title: "게스트는 이용할 수 없는 기능입니다.",
    status: "error",
  },
  error: {
    title: "오류가 발생했습니다. 관리자에게 문의해주세요.",
    status: "error",
  },
  empty: {
    title: "누락된 항목이 존재합니다.",
    status: "info",
  },
};

export const useTypeToast = () => {
  const toast = useChakraToast();

  const showToast = useCallback(
    (type: ToastType) => {
      toast({
        status: "success",
        duration: 3000,
        variant: "subtle",
        colorScheme: TOAST_MAP[type]?.status ? undefined : "mint",
        ...TOAST_MAP[type],
        containerStyle: {
          marginBottom: "76px",
        },
      });
    },
    [toast],
  );

  return showToast;
};
export const usePointToast = () => {
  const toast = useChakraToast();

  const showToast = useCallback(
    (value: number) => {
      toast({
        status: "success",

        duration: 3000,
        variant: "subtle",
        colorScheme: "mint",
        title: `${value} Point 획득!`,
        containerStyle: {
          marginBottom: "76px",
        },
      });
    },
    [toast],
  );

  return showToast;
};

export const useFailToast = () => {
  const toast = useChakraToast();

  const showFailToast = useCallback(
    (type: FailToast, sub?: string) => {
      let text = "";
      if (type === "free") text = sub;
      if (type === "error") text = "오류가 발생했어요! 관리자에게 문의해주세요!";
      if (type === "guest") text = "게스트는 사용할 수 없는 기능입니다.";
      if (type === "loadStudy") text = "스터디 정보를 불러오지 못 했어요.";
      if (type === "apply") text = "신청에 실패했어요. 조건을 확인해 주세요!";
      if (type === "time") text = "입력하신 시간을 다시 확인해주세요!";

      toast({
        title: "실패",
        description: text,
        status: "error",
        duration: 3000,
        isClosable: true,

        variant: "subtle",
        containerStyle: {
          marginBottom: "76px",
        },
      });
    },
    [toast],
  );
  return showFailToast;
};

export const useErrorToast = () => {
  const failToast = useFailToast();
  const handleError = (err: AxiosError) => {
    console.error(err);
    failToast("error");
  };
  return handleError;
};

export const useTypeErrorToast = () => {
  const failToast = useFailToast();
  const handleError = (err: AxiosError, type: "user" | "study") => {
    console.error(err);
    if (type === "user")
      failToast("free", "유저 정보를 확인할 수 없습니다. 관리자에게 문의해주세요!");

    if (type === "study")
      failToast("free", "스터디 정보를 가져올 수 없습니다. 관리자에게 문의해주세요!");
  };
  return handleError;
};
