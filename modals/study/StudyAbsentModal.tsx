import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";

import Textarea from "../../components/atoms/Textarea";
import { IModal } from "../../types/components/modalTypes";
import { StudyMemberProps } from "../../types/models/studyTypes/baseTypes";
import { StudyType } from "../../types/models/studyTypes/helperTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface StudyAbsentModalProps extends IModal {
  studyType: StudyType;
  handleAbsence: (props: { message: string; fee: number }) => void;
  myStudyInfo: StudyMemberProps;
}

function StudyAbsentModal({
  studyType,
  myStudyInfo,
  handleAbsence,
  setIsModal,
}: StudyAbsentModalProps) {
  const [value, setValue] = useState<string>("");

  // const { mutate: absentStudy } = useStudyAbsenceMutation(dayjs(date), {
  //   onSuccess: () => {
  //     typeToast("success");
  //     let fee: { value: number; message: string };
  //     if (studyStatus !== "open") fee = { value: 100, message: "개인 스터디 불참" };
  //     else if (dayjs() < dayjs(startTime)) fee = { value: 300, message: "당일 스터디 불참" };
  //     else fee = { value: 500, message: "늦은 스터디 불참" };
  //     getDeposit(fee);
  //     resetStudy();
  //     sendRequest({
  //       writer: session.user.name,
  //       title: session.user.uid + `D${fee.value}`,
  //       category: "불참",
  //       content: value,
  //     });
  //   },
  //   onError: () => typeToast("error"),
  // });

  const isLate = dayjs(myStudyInfo?.time.start).isBefore(dayjs().subtract(1, "hour"));

  const footerOptions: IFooterOptions = {
    main: {
      text: "불참",
      func: () => handleAbsence({ message: value, fee: isLate ? -300 : -200 }),
    },
    sub: {
      text: "취소",
    },
  };

  return (
    <>
      <ModalLayout title="당일 불참" footerOptions={footerOptions} setIsModal={setIsModal}>
        <Body>
          {studyType === "realTimeStudy" ? (
            <P>
              개인 스터디 불참도 벌금 <b>100원</b>이 부과됩니다. <br />
              시간을 변경해 보는 것은 어떨까요?
            </P>
          ) : isLate ? (
            <P>
              스터디 시작 시간이 지났기 때문에, 벌금 <b>300원</b>이 부과됩니다. 특별한 사유가 있다면
              적어주세요!
            </P>
          ) : (
            <P>
              당일 불참으로 벌금 <b>200원</b>이 부과됩니다. 참여 시간을 변경해 보는 건 어떨까요?
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
  text-align: start;
`;

const P = styled.p`
  margin-bottom: 12px;
`;

export default StudyAbsentModal;
