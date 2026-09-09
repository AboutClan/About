import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { MainLoading } from "@/components/atoms/loaders/MainLoading";
import Slide from "@/components/layouts/PageSlide";
import { ModalLayout } from "@/components/modals/Modals";
import { useStudyPassedDayQuery, useStudySetQuery } from "@/features/study/hooks/queries";
import StudyIntroduceDrawer from "@/features/study/screens/StudyIntroduceDrawer";
import StudyMyApplySection from "@/features/study/screens/StudyMyApplySection";
import StudyUnmatchedBanner from "@/features/study/screens/StudyUnmatchedBanner";
import { LocationAddDrawer } from "@/features/studyMap/components/LocationAddDrawer";
import StudyCrewRow from "@/features/studyPage/screens/StudyCrewRow";
import StudyPageHeader from "@/features/studyPage/screens/StudyPageHeader";
import StudyPagePlaceSection from "@/features/studyPage/screens/StudyPagePlaceSection";
import StudyControlButton from "@/features/vote/screens/StudyControlButton";
import { useToast } from "@/hooks/custom/CustomToast";
import { useUserInfo } from "@/hooks/custom/UserHooks";
import { StudyConfirmedMemberProps } from "@/types/models/studyTypes/study-entity.types";
import { getTodayStr } from "@/utils/dateTimeUtils";

type ModalType = "cafe" | "introduce" | null;

export default function StudyPage() {
  const router = useRouter();

  const toast = useToast();

  const { data: session } = useSession();
  const userInfo = useUserInfo();

  const [date, setDate] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  // 오늘 결과가 확정된 뒤, 내가 매칭에서 빠졌는지. 서버가 unmatchedUsers를 내려주지만
  // 지금까지 컨버터에서 버려져 화면에 도달하지 못했다.
  const isUnmatchedToday = useMemo(() => {
    if (!studySet?.unmatched?.length || !userInfo?._id) return false;

    return studySet.unmatched.some(
      (entry) =>
        entry.date === getTodayStr() && entry.users.some((user) => user._id === userInfo._id),
    );
  }, [studySet?.unmatched, userInfo?._id]);

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

      {isUnmatchedToday && (
        <Slide>
          <Box mb={4}>
            <StudyUnmatchedBanner
              // drawer=apply가 StudyControlButton의 시트를 열고,
              // modal=apply를 StudyControlDrawer가 받아 신청 드로어까지 연다.
              onApplyOtherDate={() => replaceQuery({ drawer: "apply", modal: "apply" })}
              onSoloStudy={() =>
                router.push(`/vote/attend/configuration?date=${getTodayStr()}&type=soloRealTimes`)
              }
            />
          </Box>
        </Slide>
      )}

      {userInfo?.role !== "guest" && studySet && (
        <Slide>
          <Box mb={4}>
            <StudyMyApplySection
              studySet={studySet}
              myId={userInfo?._id}
              onEdit={() => replaceQuery({ drawer: "apply", modal: "applyChange" })}
            />
          </Box>
        </Slide>
      )}

      <Slide>
        <StudyPagePlaceSection
          studySet={isPassedDate ? passedStudyData : studySet}
          date={date}
          setDate={setDate}
        />
      </Slide>

      {isLoading && <MainLoading />}

      {modal === "cafe" && <LocationAddDrawer onClose={closeDrawer} />}

      {userInfo?.role !== "guest" && (
        <Box mb={20} mt={5}>
          <StudyControlButton date={date} />
        </Box>
      )}

      {modal === "introduce" && <StudyIntroduceDrawer onClose={closeDrawer} />}
    </>
  );
}
