import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

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
import { ModalLayout } from "../../../modals/Modals";
import { IStudyVoteTime } from "../../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import { getLocationSimpleText } from "../../../utils/stringUtils";

interface StudyDateDrawerProps {
  onClose: () => void;
  defaultDate?: string;
  defaultCoordinates: {
    lat: number;
    lon: number;
    locationDetail: string;
  };
  canChange?: boolean;
  // date: string;
  // handleStudyVote: (voteData: StudyVoteProps | RealTimeVoteProps) => void;
}

function StudyApplyDrawer({
  onClose,
  defaultDate,
  defaultCoordinates,
  canChange = false,
}: StudyDateDrawerProps) {
  const toast = useToast();
  const resetStudy = useResetStudyQuery();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isModal, setIsModal] = useState(false);

  const { data: userInfo } = useUserInfoQuery();
  const { studySet } = useStudySetQuery(dayjsToStr(dayjs()), true);

  const defaultDates =
    studySet &&
    studySet.participations
      .filter((par) => par.study.user._id === userInfo?._id)
      .map((par) => par.date);

  useEffect(() => {
    if (!canChange) {
      if (!defaultDates.includes(defaultDate) && defaultDate) {
        setSelectedDates([defaultDate]);
      }
    } else setSelectedDates((old) => [...old, ...defaultDates]);
  }, [defaultDate, canChange]);

  // useEffect(() => {
  //   if (!defaultDates) return;
  //   setSelectedDates(defaultDates);
  // }, [studySet]);

  const { mutate: voteDateArr } = useStudyVoteArrMutation(selectedDates, {
    onSuccess() {
      toast("success", "스터디 신청이 완료되었습니다.");
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
      if (canChange) {
        setIsModal(true);
        return;
      }

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
          locationDetail: defaultCoordinates
            ? defaultCoordinates.locationDetail
            : getLocationSimpleText(userInfo.locationDetail.text),
          latitude: defaultCoordinates ? defaultCoordinates.lat : userInfo.locationDetail.lat,
          longitude: defaultCoordinates ? defaultCoordinates.lon : userInfo.locationDetail.lon,
          start: voteTime.start,
          end: voteTime.end,
        });
      },
    },
  };

  return (
    <>
      <RightDrawer title="" onClose={onClose}>
        <PageIntro
          main={{
            first: "스터디 희망 날짜를 선택해 주세요.",
          }}
          sub="여러 날짜를 한번에 신청할 수도 있습니다."
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
          mintDateArr={canChange ? [] : defaultDates}
        />
        {canChange ? (
          <Box as="li" fontSize="12px" lineHeight="20px" mt={3} color="gray.600">
            스터디를 취소하는 경우{" "}
            <Box as="span" color="mint">
              민트색
            </Box>{" "}
            날짜를 해제해 주세요.
          </Box>
        ) : !canChange && defaultDates.length ? (
          <Box as="li" fontSize="12px" lineHeight="20px" mt={3} color="gray.600">
            <Box as="span" color="mint">
              민트색
            </Box>{" "}
            숫자는 이미 신청중인 스터디입니다.
          </Box>
        ) : null}
        <Box as="li" fontSize="12px" lineHeight="20px" mt={3} color="gray.600">
          최대 일주일 이내의 스터디만 신청할 수 있습니다.
        </Box>

        <BottomNav isSlide={false} text="다 음" onClick={handleBottomNav} />
      </RightDrawer>
      {isTimeDrawer && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsTimeDrawer}
          // defaultVoteTime={{ start: dayjs(), end: dayjs().add(3, "hour") }}
        />
      )}
      {isModal && (
        <ModalLayout
          title="스터디 취소 확인"
          setIsModal={setIsModal}
          footerOptions={{
            main: {
              text: "취소할게요",
              func: () => {
                async () => {
                  await setSelectedDates([]);
                };
              },
            },
            sub: {
              text: "닫 기",
              func: () => {
                setIsModal(false);
              },
            },
          }}
        >
          스터디 신청을 완전히 취소하시겠어요?
        </ModalLayout>
      )}
    </>
  );
}

export default StudyApplyDrawer;
