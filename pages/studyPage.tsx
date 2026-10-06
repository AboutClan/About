import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MainLoading } from "@/components/atoms/loaders/MainLoading";
import ControlButton from "@/components/ControlButton";
import Slide from "@/components/layouts/PageSlide";
import { STUDY_RESULT_HOUR } from "@/constants/serviceConstants/studyConstants/studyTimeConstant";
import { useStudyBadgeRankingQuery, useStudySetQuery } from "@/features/study/hooks/queries";
import StudyControlDrawer from "@/features/study/screens/modals/StudyControlDrawer";
import StudyIntroduceDrawer from "@/features/study/screens/StudyIntroduceDrawer";
import StudyMyCard from "@/features/studyPage/screens/StudyMyCard";
import StudyPageHeader from "@/features/studyPage/screens/StudyPageHeader";
import StudyWeekCardList from "@/features/studyPage/screens/StudyWeekCardList";
import { CheckIcon } from "@/features/vote/screens/StudyControlButton";
import { useToast } from "@/hooks/custom/CustomToast";
import { useCheckGuest, useUserInfo } from "@/hooks/custom/UserHooks";
import { StudyConfirmedMemberProps } from "@/types/models/studyTypes/study-entity.types";
import { getTodayStr } from "@/utils/dateTimeUtils";

/** 공부 스타일 설문을 닫은 시각. 저장하지 않고 닫아도 이 기간에는 다시 띄우지 않는다. */
const INTRODUCE_DISMISSED_KEY = "studyIntroduceDismissedAt";
const INTRODUCE_SNOOZE_DAYS = 7;

type ControlModal = "apply" | "open";

export default function StudyPage() {
  const router = useRouter();
  const toast = useToast();

  const { data: session } = useSession();
  const userInfo = useUserInfo();
  // 유저 정보를 받기 전에는 undefined다. 그 사이에 게스트를 회원으로 보고 드로어를 열면 안 된다.
  const guestState = useCheckGuest();
  const isGuest = guestState !== false;
  const isUserReady = guestState !== undefined;

  const [isControlDrawer, setIsControlDrawer] = useState(false);
  /**
   * ?modal= 을 이 화면이 push로 얹었는지. 그랬다면 닫을 때 router.back()으로 걷고,
   * 첫 진입·replace로 붙어 온 것이면 back이 페이지를 빠져나가므로 replace로 걷는다.
   */
  const isModalPushedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  const today = getTodayStr();
  const resultParam = router.query.result as string | undefined;
  const drawerParam = router.query.drawer as string | undefined;
  const modalParam = router.query.modal as string | undefined;
  const isIntroduce = modalParam === "introduce";

  // 주간 데이터(오늘부터 8일)를 한 번 받아 내 스터디 카드와 목록이 같이 쓴다.
  const { data: studySet } = useStudySetQuery(today);

  const { data: badgeRanking } = useStudyBadgeRankingQuery({
    enabled: !isGuest,
  });

  /** 쿼리스트링만 바꾼다(기록을 쌓지 않는다). 쌓으면 뒤로 가기가 같은 화면을 맴돈다. */
  const replaceQuery = (query: Record<string, string | null>) => {
    const nextQuery = { ...router.query, ...query };
    Object.keys(nextQuery).forEach((key) => nextQuery[key] == null && delete nextQuery[key]);

    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  /**
   * 아직 매칭 전인 내 신청이 있는가. 하단 버튼 문구("신청 변경하기")에 쓴다.
   * 직접 개설·참여(openRealTimes)는 매칭 신청이 아니므로 보지 않는다.
   */
  const hasApplied = useMemo(() => {
    if (!studySet || !userInfo?._id) return false;
    const myId = userInfo._id;
    const isOpenForApply = (date: string) =>
      date > today || (date === today && dayjs().hour() < STUDY_RESULT_HOUR);
    return studySet.participations.some(
      (day) => isOpenForApply(day.date) && day.study.some((par) => par.user?._id === myId),
    );
  }, [studySet, userInfo?._id, today]);

  const handleGuest = () => replaceQuery({ guest: "on" });

  /** ?modal= 을 push로 얹는다. 앱 뒤로가기(Layout)가 열린 오버레이로 보고 닫아 준다. */
  const pushModal = (modal: string, baseQuery = router.query) => {
    isModalPushedRef.current = true;
    router.push({ pathname: router.pathname, query: { ...baseQuery, modal } }, undefined, {
      shallow: true,
      scroll: false,
    });
  };

  const closeModal = () => {
    if (!isModalPushedRef.current) replaceQuery({ modal: null });
    isModalPushedRef.current = false;
  };

  /** 신청·개설 드로어. */
  const openControl = (modal: ControlModal, baseQuery = router.query) => {
    if (!isUserReady) return;
    if (isGuest) {
      handleGuest();
      return;
    }
    pushModal(modal, baseQuery);
    setIsControlDrawer(true);
  };

  // 공부 스타일 설문: 처음 한 번 띄우고, 저장 없이 닫아도 일주일 동안은 다시 띄우지 않는다.
  // 앱 뒤로가기로 닫히도록 ?modal=introduce 로 연다.
  useEffect(() => {
    if (!router.isReady || !userInfo || !isUserReady || isGuest) return;
    if (userInfo.studyIntroduce?.studyStyle || modalParam || drawerParam) return;

    let dismissedAt: string | null = null;
    try {
      dismissedAt = localStorage.getItem(INTRODUCE_DISMISSED_KEY);
    } catch {
      // 저장소를 못 쓰면 닫은 기록이 없는 것으로 보고 띄운다.
    }
    if (dismissedAt && dayjs().diff(dayjs(dismissedAt), "day") < INTRODUCE_SNOOZE_DAYS) return;

    // 뒤로가기로 닫으면 닫기 버튼을 거치지 않으므로, 띄운 시점에 기록한다.
    try {
      localStorage.setItem(INTRODUCE_DISMISSED_KEY, new Date().toISOString());
    } catch {
      // 무시: 다음 방문에 다시 뜰 뿐이다.
    }
    pushModal("introduce");
  }, [router.isReady, userInfo, isUserReady, isGuest]);

  // 예전 링크 호환: ?drawer=apply|on 은 신청 드로어, ?modal=apply|open 은 해당 드로어를 바로 연다.
  useEffect(() => {
    if (!router.isReady || !isUserReady) return;

    if (drawerParam === "apply" || drawerParam === "on") {
      if (isGuest) {
        replaceQuery({ drawer: null, guest: "on" });
        return;
      }
      // drawer를 지운 뒤 modal을 push로 얹는다. 드로어를 닫을 때 router.back()이
      // 이 페이지로 돌아오게 하려는 것이다(replace로 얹으면 페이지 밖으로 나간다).
      const nextQuery = { ...router.query };
      delete nextQuery.drawer;
      router
        .replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true })
        .then(() => openControl("apply", nextQuery));
      return;
    }

    if ((modalParam === "apply" || modalParam === "open") && !isGuest) {
      setIsControlDrawer(true);
    }
  }, [router.isReady, drawerParam, modalParam, isUserReady, isGuest]);

  // 앱 뒤로가기 등으로 ?modal= 이 걷히면 드로어 상태도 같이 정리한다.
  useEffect(() => {
    if (modalParam) return;
    isModalPushedRef.current = false;
    setIsControlDrawer(false);
  }, [modalParam]);

  // 푸시의 ?result= 로 들어오면 오늘 내 스터디 상세로 보낸다.
  useEffect(() => {
    if (!router.isReady || !resultParam || !session) return;

    if (!studySet) {
      setIsLoading(true);
      return;
    }

    const isMine = (members: StudyConfirmedMemberProps[]) =>
      members.some((member) => member.user.uid === session.user.uid);

    const result = studySet.results.find(
      (entry) => entry.date === today && isMine(entry.study.members),
    );
    const realTime = studySet.openRealTimes.find(
      (entry) => entry.date === today && isMine(entry.study.members),
    );

    const openUrl = result
      ? `/study/${result.study.place._id}/${today}?type=results`
      : realTime
        ? `/study/${realTime.study.place._id}/${today}?type=openRealTimes`
        : null;

    if (openUrl) {
      router.replace(openUrl);
      return;
    }

    toast("info", "오늘 참석중인 스터디가 없습니다.");
    replaceQuery({ result: null });
    setIsLoading(false);
  }, [router.isReady, resultParam, studySet, session]);

  const closeIntroduce = () => {
    if (isModalPushedRef.current) router.back();
    closeModal();
  };

  return (
    <>
      <StudyPageHeader />

      <Slide>
        {/* 내 스터디 카드는 헤더 바로 아래에 붙인다(사이 여백 없이). */}
        <Box>
          <StudyMyCard
            studySet={studySet}
            myId={userInfo?._id}
            isGuest={isGuest}
            badgeRanking={badgeRanking}
            onOpenRanking={() => router.push("/ranking?tab=study")}
          />
        </Box>

        {/* 직접 개설은 신청 드로어 안에서 연다(StudyApplyDrawer onOpenStudy). */}
        <Box mt={3} mb={36}>
          <StudyWeekCardList
            studySet={studySet}
            myId={userInfo?._id}
            onOpenStudy={() => openControl("open")}
          />
        </Box>
      </Slide>

      {/* 문구가 신청 여부로 갈리므로 데이터가 온 뒤에 그린다(로딩 중 문구가 바뀌는 깜빡임 방지). */}
      {studySet && (
        <ControlButton
          text={hasApplied ? "신청 변경" : "스터디 신청"}
          rightIcon={<CheckIcon />}
          handleClick={() => openControl("apply")}
          hasBottomNav
        />
      )}

      {isLoading && <MainLoading />}

      {isControlDrawer && (
        <StudyControlDrawer
          // 신청 드로어는 이 값을 오늘로 보고 기본 날짜를 "오늘(9시 이후면 내일)"로 잡는다.
          date={today}
          hideMenu
          closeWithBack={isModalPushedRef.current}
          onClose={() => {
            setIsControlDrawer(false);
            closeModal();
          }}
        />
      )}

      {isIntroduce && <StudyIntroduceDrawer onClose={closeIntroduce} />}
    </>
  );
}

