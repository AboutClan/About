import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { MainLoading } from "../components/atoms/loaders/MainLoading";
import Slide from "../components/layouts/PageSlide";
import { useToast } from "../hooks/custom/CustomToast";
import { useUserInfo } from "../hooks/custom/UserHooks";
import { useStudyPassedDayQuery, useStudySetQuery } from "../hooks/study/queries";
import { ModalLayout } from "../modals/Modals";
import StudyIntroduceDrawer from "../pageTemplates/study/StudyIntroduceDrawer";
import { LocationAddDrawer } from "../pageTemplates/studyPage/LocationAddDrawer";
import StudyCrewRow from "../pageTemplates/studyPage/StudyCrewRow";
import StudyPageHeader from "../pageTemplates/studyPage/StudyPageHeader";
import StudyPagePlaceSection from "../pageTemplates/studyPage/StudyPagePlaceSection";
import StudyControlButton from "../pageTemplates/vote/StudyControlButton";
import { StudyConfirmedMemberProps } from "../types/models/studyTypes/study-entity.types";
import { getTodayStr } from "../utils/dateTimeUtils";

type ModalType = "cafe" | "introduce" | null;

export default function StudyPage() {
  const router = useRouter();

  const toast = useToast();

  const { data: session } = useSession();
  const userInfo = useUserInfo();

  const [date, setDate] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(true);

  const isGuest = session?.user.role === "guest";

  const dateParam = router.query.date as string | undefined;
  const resultParam = router.query.result as string | undefined;

  const isPassedDate = useMemo(
    () => !!date && dayjs(date).startOf("day").isBefore(dayjs().startOf("day")),
    [date],
  );

  const { data: studySet } = useStudySetQuery(date, {
    enabled: !!date && !isPassedDate,
  });

  const { data: passedStudyData } = useStudyPassedDayQuery(date, {
    enabled: !!date && isPassedDate,
  });

  const replaceQuery = (query: Record<string, string | null | undefined>) => {
    const nextQuery = {
      ...router.query,
      ...query,
    };

    Object.entries(nextQuery).forEach(([key, value]) => {
      if (value == null) {
        delete nextQuery[key];
      }
    });

    router.push(
      {
        pathname: router.pathname,
        query: nextQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      },
    );
  };

  const removeQuery = (key: string) => {
    const nextQuery = { ...router.query };
    delete nextQuery[key];

    router.replace(
      {
        pathname: router.pathname,
        query: nextQuery,
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  useEffect(() => {
    if (!router.isReady || !userInfo || userInfo.role === "guest") return;

    if (!userInfo.studyIntroduce.studyStyle) {
      setModal("introduce");
      replaceQuery({ modal: "introduce" });
    }
  }, [router.isReady, userInfo]);

  useEffect(() => {
    if (!router.isReady) return;

    if (dateParam) {
      setDate(dateParam);
      return;
    }

    const today = getTodayStr();
    setDate(today);
    replaceQuery({ date: today });
  }, [router.isReady, dateParam]);

  useEffect(() => {
    if (!router.isReady || !date || dateParam === date) return;

    replaceQuery({ date });
  }, [router.isReady, date, dateParam]);

  useEffect(() => {
    if (!router.isReady || !resultParam || !session) return;

    if (!studySet) {
      setIsLoading(true);
      return;
    }

    let openUrl: string | undefined;

    studySet.results.forEach((result) => {
      if (result.date !== getTodayStr()) return;

      const study = result.study;
      const myStudy = study.members.find(
        (member: StudyConfirmedMemberProps) => member.user.uid === session.user.uid,
      );

      if (myStudy) {
        openUrl = `/study/${study.place._id}/${getTodayStr()}?type=results`;
      }
    });

    studySet.openRealTimes.forEach((realTime) => {
      if (realTime.date !== getTodayStr()) return;

      const study = realTime.study;
      const myStudy = study.members.find(
        (member: StudyConfirmedMemberProps) => member.user.uid === session.user.uid,
      );

      if (myStudy) {
        openUrl = `/study/${study.place._id}/${getTodayStr()}?type=openRealTimes`;
      }
    });

    if (openUrl) {
      router.replace(openUrl);
      return;
    }

    toast("info", "오늘 참석중인 스터디가 없습니다.");
    removeQuery("result");
    setIsLoading(false);
  }, [router.isReady, resultParam, studySet, session]);

  const closeDrawer = () => {
    setModal(null);
    removeQuery("modal");
  };

  return (
    <>
      <StudyPageHeader />

      <Slide isNoPadding>
        <StudyCrewRow />
      </Slide>

      <Slide>
        <StudyPagePlaceSection
          studySet={isPassedDate ? passedStudyData : studySet}
          date={date}
          setDate={setDate}
        />
      </Slide>

      {isLoading && <MainLoading />}

      {modal === "cafe" && <LocationAddDrawer onClose={closeDrawer} />}

      <Box mb={20} mt={5}>
        <StudyControlButton date={date} />
      </Box>

      {modal === "introduce" && <StudyIntroduceDrawer onClose={closeDrawer} />}

      {isMaintenanceOpen && (
        <ModalLayout
          title="2학기 스터디가 곧 시작돼요!"
          setIsModal={() => {
            setIsMaintenanceOpen(false);
          }}
          footerOptions={{}}
        >
          <p>
            학교나 집 근처에서 편하게 만나 <br />
            같이 공부할 수 있는 <b>어바웃 카공스터디</b> <br />
            <br />
            8월 26일(수)부터 31일(월)까지
            <br /> 새 학기 활동 준비를 위해 잠시 쉬어갑니다.
            <br /> <b>9월 1일(화)</b>, 2학기 스터디가 시작됩니다.
          </p>
        </ModalLayout>
      )}
    </>
  );
}
