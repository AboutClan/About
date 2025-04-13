import dayjs from "dayjs";
import { useRouter } from "next/router";

import { POINT_SYSTEM_DEPOSIT } from "../../constants/serviceConstants/pointSystemConstants";
import { PLACE_TO_NAME } from "../../constants/serviceConstants/studyConstants/studyCafeNameConstants";
import { useCompleteToast, useErrorToast } from "../../hooks/custom/CustomToast";
import { useStudyAbsenceMutation } from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function StudyLightAbsentModal({ setIsModal }: IModal) {
  const completeToast = useCompleteToast();
  const errorToast = useErrorToast();
  const router = useRouter();
  const voteDate = dayjs(router.query.date as string);

  const placeId = router.query.placeId;
  const isPrivate = PLACE_TO_NAME[placeId as string] === "자유신청";

  const { mutate: getDeposit } = usePointSystemMutation("deposit");
  const { mutate: absentStudy } = useStudyAbsenceMutation(voteDate, {
    onSuccess: () => {
      const fee = POINT_SYSTEM_DEPOSIT.STUDY_PRIVATE_ABSENT;
      if (isPrivate) getDeposit(fee);
      completeToast("success");
    },
    onError: errorToast,
  });

  const footerOptions: IFooterOptions = {
    main: {
      text: "불참",
      func: () => absentStudy(null),
      isred: true,
    },
  };

  return (
    <ModalLayout footerOptions={footerOptions} title="개인 스터디 불참" setIsModal={setIsModal}>
      불참하시겠어요? <br />
      {isPrivate && "-100원의 벌금이 발생합니다."}
    </ModalLayout>
  );
}

export default StudyLightAbsentModal;
