import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";

import Textarea from "../../components/atoms/Textarea";
import { IModal } from "../../types/components/modalTypes";
import { StringTimeProps } from "../../types/utils/timeAndDate";
import { IFooterOptions, ModalLayout } from "../Modals";

interface StudyAbsentModalProps extends IModal {
  times: StringTimeProps;
  handleAbsence: (absence: { message: string; fee: number }) => void;

  // studyType: StudyType;
  // handleAbsence: (props: { message: string; fee: number }) => void;
  // myStudyInfo: StudyConfirmedMemberProps;
}

function StudyAbsentModal({
  times,
  handleAbsence,
  // studyType,
  // myStudyInfo,
  // handleAbsence,
  setIsModal,
}: StudyAbsentModalProps) {
  const [value, setValue] = useState<string>("");

  const startTimeBefore = dayjs(times.start);
  const startTime = dayjs().hour(startTimeBefore.hour()).minute(startTimeBefore.minute());

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

  const isLate = dayjs().isAfter(startTime.add(1, "hour"));

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
        <>
          <Box as="p" mb={3}>
            {isLate ? (
              <>
                스터디 시작 시간이 지났기 때문에, 벌금 <b>1,000원</b>이 부과됩니다. 특별한 사유가
                있다면 적어주세요!
              </>
            ) : (
              <>
                당일 불참으로 벌금 <b>500원</b>이 발생합니다.
                <br /> 참여 시간을 변경해 보는 건 어떨까요?
              </>
            )}
          </Box>
          <Box w="full">
            <Textarea
              value={value}
              placeholder="불참 사유를 적어주시면, 벌금이 완화될 수 있습니다."
              onChange={(e) => setValue(e.target.value)}
            />
          </Box>
        </>
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
