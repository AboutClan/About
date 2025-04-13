import { Box } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useUserInfoFieldMutation } from "../../hooks/user/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface RequestBirthModalProps extends IModal {
  type: "profile" | "location";
}

function RequestBirthModal({ setIsModal, type }: RequestBirthModalProps) {
  const typeToast = useTypeToast();
  const { data: session } = useSession();

  const { mutate } = useUserInfoFieldMutation(
    type === "profile" ? "isPrivate" : "isLocationSharingDenided",
    {
      onSuccess() {
        typeToast("change");
        setIsModal(false);
      },
    },
  );

  const footerOptions: IFooterOptions = {
    sub: {
      text: "비공개",
      func: () => {
        const data = type === "profile" ? { isPrivate: true } : { isLocationSharingDenided: false };
        mutate(data);
      },
    },
    main: {
      text: "공개",
      func: () => {
        const data = type === "profile" ? { isPrivate: false } : { isLocationSharingDenided: true };
        mutate(data);
      },
    },
  };

  return (
    <ModalLayout
      footerOptions={footerOptions}
      title={type === "profile" ? "프로필 공개 설정" : "스터디 위치 공개 설정"}
      setIsModal={setIsModal}
    >
      <Box textAlign="start">
        {type === "profile"
          ? `친구로 등록된 인원을 제외하고, ${session?.user.name}님의 프로필을 확인할 수 없습니다.`
          : `친구로 등록된 인원을 제외하고, ${session?.user.name}님의 스터디 활동 위치를 확인할 수 없습니다.`}
      </Box>
    </ModalLayout>
  );
}

export default RequestBirthModal;
