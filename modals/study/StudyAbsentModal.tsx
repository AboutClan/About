import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import Textarea from "../../components/atoms/Textarea";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyAbsentMutation } from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { findMyStudyInfo } from "../../libs/study/studySelectors";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface StudyAbsentModalProps extends IModal {}

function StudyAbsentModal({ setIsModal }: StudyAbsentModalProps) {
  const typeToast = useTypeToast();
  const resetStudy = useResetStudyQuery();
  const { data: session } = useSession();
  const { date } = useParams<{ id: string; date: string }>();

  const [value, setValue] = useState<string>("");

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);

  const { mutate: sendRequest } = useUserRequestMutation();
  const { mutate: getDeposit } = usePointSystemMutation("deposit");

  const myStudyInfo = findMyStudyInfo(myStudyParticipation, session?.user.uid);
  const startTime = myStudyInfo?.time?.start;
  const studyStatus = myStudyParticipation?.status;

  const { mutate: absentStudy } = useStudyAbsentMutation(dayjs(date), {
    onSuccess: () => {
      typeToast("success");
      let fee: { value: number; message: string };
      if (studyStatus !== "open") fee = { value: 100, message: "개인 스터디 불참" };
      else if (dayjs() < dayjs(startTime)) fee = { value: 300, message: "당일 스터디 불참" };
      else fee = { value: 500, message: "늦은 스터디 불참" };
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

  const footerOptions: IFooterOptions = {
    main: {
      text: "불참",
      func: () => absentStudy(value),
    },
    sub: {
      text: "취소",
    },
  };

  return (
    <>
      <ModalLayout title="당일 불참" footerOptions={footerOptions} setIsModal={setIsModal}>
        <Body>
          {studyStatus !== "open" ? (
            <P>
              개인 스터디 불참도 벌금 <b>100원</b>이 부과됩니다. <br />
              시간을 변경해 보는 것은 어떨까요?
            </P>
          ) : dayjs() < dayjs(startTime) ? (
            <P>
              스터디 시작 시간이 지났기 때문에 벌금 <b>500원</b>이 부과됩니다. 시간을 변경해 보는
              것은 어떨까요?{" "}
            </P>
          ) : (
            <P>
              당일 불참으로 벌금 <b>300원</b>이 부과됩니다. 참여 시간을 변경해 보는 건 어떨까요?
            </P>
          )}
          <Box w="full">
            <Textarea
              value={value}
              placeholder="불참 사유를 적어주세요"
              onChange={(e) => setValue(e.target.value)}
            />
          </Box>
        </Body>
      </ModalLayout>
    </>
  );
}

const Body = styled.div`
  width: 100%;
  flex: 1;
`;

const P = styled.p`
  margin-bottom: 12px;
`;

export default StudyAbsentModal;
