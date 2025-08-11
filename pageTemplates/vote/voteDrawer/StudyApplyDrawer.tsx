import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import PageIntro from "../../../components/atoms/PageIntro";
import BottomNav from "../../../components/layouts/BottomNav";
import MonthCalendar from "../../../components/molecules/MonthCalendar";
import { BottomFlexDrawerOptions } from "../../../components/organisms/drawer/BottomFlexDrawer";
import RightDrawer from "../../../components/organisms/drawer/RightDrawer";
import StudyVoteTimeRulletDrawer from "../../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { useResetStudyQuery } from "../../../hooks/custom/CustomHooks";
import { useToast } from "../../../hooks/custom/CustomToast";
import { useStudySetQuery } from "../../../hooks/custom/StudyHooks";
import { useStudyVoteArrMutation } from "../../../hooks/study/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { CalendarHeader } from "../../../modals/aboutHeader/DateCalendarModal";
import { IStudyVoteTime } from "../../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../../utils/dateTimeUtils";

interface StudyDateDrawerProps {
  onClose: () => void;
  // date: string;
  // handleStudyVote: (voteData: StudyVoteProps | RealTimeVoteProps) => void;
}

function StudyApplyDrawer({ onClose }: StudyDateDrawerProps) {
  const toast = useToast();
  const resetStudy = useResetStudyQuery();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const { data: userInfo } = useUserInfoQuery();
  const { studySet } = useStudySetQuery(dayjsToStr(dayjs()), true);

  const defaultDates =
    studySet &&
    studySet.participations
      .filter((par) => par.study.user._id === userInfo?._id)
      .map((par) => par.date);

  // useEffect(() => {
  //   if (!defaultDates) return;
  //   setSelectedDates(defaultDates);
  // }, [studySet]);

  const { mutate: voteDateArr } = useStudyVoteArrMutation(selectedDates, {
    onSuccess() {
      resetStudy();
      onClose();
    },
  });

  // const { mutate: participateStudyOne } = useStudyParticipateMutation(dayjs(date), {
  //   onSuccess() {
  //     toast("success", "참여가 완료되었습니다. 출석 인증도 잊지 마세요!");
  //     resetStudy();
  //     onClose();
  //   },
  // });

  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeDrawer, setIsTimeDrawer] = useState(false);
  const [date, setDate] = useState(dayjs());

  const handleBottomNav = () => {
    if (!selectedDates.length) {
      toast("warning", "날짜를 선택해 주세요");
      return;
    }
    setIsTimeDrawer(true);
  };

  const handleClickDate = (date: string) => {
    setSelectedDates((old) => {
      if (old.includes(date)) {
        return old.filter((d) => d !== date);
      } else {
        return [...old, date];
      }
    });
  };

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "예상 참여 시간을 선택해 주세요",
      subTitle: "스터디 전까지 언제든 변경할 수 있습니다.",
    },
    footer: {
      text: "신청 완료",
      func: () => {
        voteDateArr({
          latitude: userInfo.locationDetail.lat,
          longitude: userInfo.locationDetail.lon,
          start: voteTime.start,
          end: voteTime.end,
        });
      },
    },
  };

  console.log(1234, selectedDates);
  return (
    <>
      <RightDrawer title="" onClose={onClose}>
        <PageIntro
          main={{
            first: "스터디 희망 날짜를 선택해 주세요.",
          }}
          sub={"여러 날짜를 한번에 신청할 수도 있습니다."}
        />
        <Box fontSize="20px" mb={4} pb={4} px={2} borderBottom="var(--border)">
          <CalendarHeader
            goNext={() => setDate((old) => old.add(1, "month"))}
            goPrev={() => setDate((old) => old.subtract(1, "month"))}
            leftDisabled={date.month() === dayjs().month()}
            rightDisabled={date.month() === dayjs().month() + 1}
            date={dayjsToStr(date)}
          />
        </Box>

        <MonthCalendar
          standardDate={dayjsToStr(date)}
          selectedDates={selectedDates}
          func={handleClickDate}
          passedDisabled
          mintDateArr={defaultDates}
        />
        <Box as="li" fontSize="12px" lineHeight="20px" mt={3} color="gray.600">
          <Box as="span" color="mint">
            민트색
          </Box>{" "}
          날짜는 이미 신청중인 스터디입니다.
        </Box>
        <BottomNav isSlide={false} text={"스터디 개설"} onClick={handleBottomNav} />
      </RightDrawer>
      {isTimeDrawer && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsTimeDrawer}
          // defaultVoteTime={{ start: dayjs(), end: dayjs().add(3, "hour") }}
        />
      )}
    </>
  );
}

export default StudyApplyDrawer;
