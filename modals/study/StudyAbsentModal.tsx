import { Textarea } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { POINT_SYSTEM_DEPOSIT } from "../../constants/serviceConstants/pointSystemConstants";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyAbsentMutation } from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";
function StudyAbsentModal({ setIsModal }: IModal) {
  const toast = useToast();
  const typeToast = useTypeToast();
  const resetStudy = useResetStudyQuery();
  const { data: session } = useSession();
  const { date } = useParams<{ id: string; date: string }>();

  const myStudy = useRecoilValue(myStudyInfoState);

  const [value, setValue] = useState<string>("");

  const { startTime } = getMyStudyVoteInfo(myStudy, session?.user.uid);

  const isFree = myStudy.status === "free";

  const { mutate: sendRequest } = useUserRequestMutation();
  const { mutate: getDeposit } = usePointSystemMutation("deposit");

  const { mutate: absentStudy } = useStudyAbsentMutation(dayjs(date), {
    onSuccess: () => {
      typeToast("success");
      let fee: { value: number; message: string };
      if (isFree) return;
      if (dayjs() > startTime) fee = POINT_SYSTEM_DEPOSIT.STUDY_ABSENT_AFTER;
      else fee = POINT_SYSTEM_DEPOSIT.STUDY_ABSENT_BEFORE;
      getDeposit(fee);
      resetStudy();
      sendRequest({
        writer: session.user.name,
        title: session.user.uid + `D${fee.value}`,
        category: "불참",
        content: value,
      });
    },
    onError: () => typeToast("error"),
  });

  const handleCancleBtn = () => {
    if (myStudy) absentStudy(value);
    else toast("error", "스터디에 참여하지 않은 인원입니다.");
    setIsModal(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "불참",
      func: handleCancleBtn,
    },
    sub: {
      text: "취소",
    },
  };

  return (
    <>
      <ModalLayout title="당일 불참" footerOptions={footerOptions} setIsModal={setIsModal}>
        <Body>
          <ModalSubtitle>
            {dayjs() < startTime ? (
              <P>
                스터디 시작 시간이 지났기 때문에 벌금 <b>500원</b>이 부여됩니다. 참여 시간을 변경해
                보는 것은 어떨까요?{" "}
              </P>
            ) : (
              <P>
                당일 불참으로 벌금 <b>{-POINT_SYSTEM_DEPOSIT.STUDY_ABSENT_BEFORE.value}원</b>이
                부과됩니다. 참여 시간을 변경해 보는 건 어떨까요?
              </P>
            )}
          </ModalSubtitle>
          <Textarea value={value} onChange={(e) => setValue(e.target.value)} />
        </Body>
      </ModalLayout>
    </>
  );
}

const Body = styled.div`
  width: 100%;
  flex: 1;
`;

const P = styled.p``;

export default StudyAbsentModal;
