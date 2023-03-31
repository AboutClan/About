import styled from "styled-components";
import {
  ModalFooterNav,
  ModalHeaderTitle,
  ModalLg,
} from "../../../styles/LayoutStyles";
import { ITimeStartToEnd, ITimeStartToEndHM } from "../../../types/utils";

import { useState, Dispatch, SetStateAction } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  useAttendMutation,
  useChangeTimeMutation,
} from "../../../hooks/vote/mutations";

import { useSession } from "next-auth/react";
import { useToast } from "@chakra-ui/react";
import { voteDateState } from "../../../recoil/studyAtoms";

import dayjs from "dayjs";
import TimeSelector from "../../../components/utils/TimeSelector";

export default function ChangeTimeModal({
  setIsChangeTimeModal,
  myVoteTime,
}: {
  setIsChangeTimeModal: Dispatch<SetStateAction<boolean>>;
  myVoteTime?: ITimeStartToEnd;
}) {
  const voteDate = useRecoilValue(voteDateState);

  const toast = useToast();
  const { data: session } = useSession();

  const startTime = dayjs(myVoteTime?.start);
  const endTime = dayjs(myVoteTime?.end);

  const [time, setTime] = useState<ITimeStartToEndHM>({
    start: {
      hour: startTime.hour(),
      minutes: startTime.minute(),
    },
    end: { hour: endTime.hour(), minutes: endTime.minute() },
  });
  const { mutate: patchAttend } = useChangeTimeMutation(voteDate, {
    onSuccess() {
      window.location.reload();
    },
    onError(err) {
      console.log(err);
    },
  });

  const onSubmit = () => {
    const start = time.start;
    const end = time.end;
    const timeInfo = {
      start: dayjs(voteDate.hour(start.hour).minute(start.minutes)),
      end: dayjs(voteDate.hour(end.hour).minute(end.minutes)),
    };
    if (start.hour * 60 + start.minutes >= end.hour * 60 + end.minutes) {
      toast({
        title: "잘못된 입력",
        description: "시작시간은 끝시간 이전이여야 합니다",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setIsChangeTimeModal(false);
    patchAttend(timeInfo);
  };
  return (
    <Layout>
      <ModalHeaderTitle>시간변경</ModalHeaderTitle>
      <TimeSelector
        setTimes={({ start, end }: ITimeStartToEndHM) => {
          if (start) setTime({ ...time, start });
          if (end) setTime({ ...time, end });
        }}
        times={time}
      />
      <BtnNav>
        <button onClick={() => setIsChangeTimeModal(false)}>취소</button>
        <button onClick={onSubmit}>변경</button>
      </BtnNav>
    </Layout>
  );
}

const Layout = styled(ModalLg)`
  display: flex;
  flex-direction: column;
  > header {
    margin-bottom: 32px;
  }
`;

const BtnNav = styled(ModalFooterNav)`
  margin-top: auto;
  text-align: end;
  > button:last-child {
    background-color: var(--color-red);
  }
`;
