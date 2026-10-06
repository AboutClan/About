import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import BottomNav from "@/components/layouts/BottomNav";
import RightDrawer from "@/components/modals/drawer/RightDrawer";
import {
  DEFAULT_RANGE_NUM,
  RANGE_TO_EPS,
} from "@/constants/serviceConstants/studyConstants/studyRangeConstant";
import { STUDY_RESULT_HOUR } from "@/constants/serviceConstants/studyConstants/studyTimeConstant";
import { StudyCancelModal } from "@/features/study/components/study/apply/ui/overlay/CancelModal";
import { PlaceDrawer } from "@/features/study/components/study/apply/ui/overlay/PlaceDrawer";
import StudyApplySection, {
  MAX_ANCHOR_COUNT,
} from "@/features/study/components/study/apply/ui/StudyApplySection";
import StudyApplyTimeSection, {
  formatTimeRange,
  presetToTime,
  StudyTimePreset,
} from "@/features/study/components/study/apply/ui/StudyApplyTimeSection";
import { useStudyVoteArrMutation } from "@/features/study/hooks/mutations";
import { useStudySetQuery } from "@/features/study/hooks/queries";
import { useResetStudyQuery } from "@/features/study/hooks/useResetStudyQuery";
import { useUserInfoQuery } from "@/features/user/hooks/queries";
import { useToast } from "@/hooks/custom/CustomToast";
import { useCheckGuest } from "@/hooks/custom/UserHooks";
import { LocationProps } from "@/types/common";
import { IStudyVoteTime } from "@/types/models/studyTypes/studyInterActions";
import { dayjsToFormat, dayjsToStr, getHour } from "@/utils/dateTimeUtils";
import { getDistanceFromLatLonInKm } from "@/utils/mathUtils";
import { getLocationSimpleText } from "@/utils/stringUtils";

interface StudyDateDrawerProps {
  onClose: () => void;
  defaultDate?: string;
  location?: LocationProps;
  canChange?: boolean;
  isLocation?: boolean;
  /** 주면 신청 화면 아래에 "직접 스터디 열기" 링크를 둔다(스터디 탭 전용). */
  onOpenStudy?: () => void;
}

// 기준점끼리 이 거리 안에 있으면 범위가 사실상 겹친다고 보고 안내한다(막지는 않는다).
// 반경 1단계의 안쪽 원(2km) 기준.
const OVERLAP_WARNING_KM = 2;

function StudyApplyDrawer({
  onClose,
  defaultDate,
  location,
  canChange = false,
  isLocation,
  onOpenStudy,
}: StudyDateDrawerProps) {
  const toast = useToast();
  const router = useRouter();
  const isGuest = useCheckGuest();
  const resetStudy = useResetStudyQuery();

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [voteLocations, setVoteLocations] = useState<LocationProps[]>([]);
  // PlaceDrawer가 편집 중인 기준점의 인덱스. voteLocations.length면 새로 추가하는 중이고,
  // null이면 드로어가 닫혀 있다.
  const [editingAnchorIndex, setEditingAnchorIndex] = useState<number | null>(null);
  const [rangeNum, setRangeNum] = useState<number>(DEFAULT_RANGE_NUM);
  // 공용 참여 시간. 새로 고른 날짜에 적용된다(기존 신청 날짜는 applyToExisting일 때만).
  const [timePreset, setTimePreset] = useState<StudyTimePreset>("afternoon");
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>(() => presetToTime("afternoon"));
  const [applyToExisting, setApplyToExisting] = useState(false);
  // 날짜별로 다른 시간. 비어 있으면 모든 날짜가 voteTime 하나를 공유한다(기존 동작).
  const [dateTimes, setDateTimes] = useState<Record<string, IStudyVoteTime>>({});

  const { data: userInfo } = useUserInfoQuery();
  const { data: studySet, isLoading: isStudySetLoading } = useStudySetQuery(dayjsToStr(dayjs()));

  const { mutate: voteDateArr, isLoading } = useStudyVoteArrMutation(selectedDates, {
    onSuccess() {
      if (selectedDates.length) {
        toast(
          "success",
          canChange || isChange
            ? "변경 완료! 오전 9시에 결과를 알려드릴게요"
            : "신청 완료! 오전 9시에 결과를 알려드릴게요",
        );
      } else {
        toast("success", "신청을 취소했어요");
      }

      resetStudy();
      onClose();
    },
    onError() {
      toast("error", "신청에 실패했어요. 잠시 후 다시 시도해 주세요.");
    },
  });

  // 사용자가 기준점을 직접 건드린 뒤로는 자동 초기화가 끼어들지 않게 한다.
  const hasEditedAnchorsRef = useRef(false);

  // 기준점 초기화는 여기 한 곳에서만 한다. (자식에서도 하면 배열을 서로 덮어써
  // 두 번째 기준점이 사라진다.)
  // location은 상위의 쿼리 결과(placeInfo?.location)에서 오므로 늦게 도착할 수 있다.
  // 그때는 기존처럼 그 값이 이기되, 사용자가 이미 편집했으면 건드리지 않는다.
  useEffect(() => {
    if (hasEditedAnchorsRef.current) return;

    const initial = location ?? userInfo?.locationDetail;
    if (!initial) return;

    setVoteLocations([initial]);
  }, [location, userInfo?.locationDetail]);

  // undefined = 아직 로딩 중. 빈 배열(신청 없음)과 반드시 구분해야 한다 —
  // 로드 전에 제출하면 기존 신청이 빠진 목록이 나가 서버가 전부 지운다.
  const beforeMyDates = useMemo(() => {
    if (!studySet?.participations || !userInfo?._id) return undefined;

    return studySet.participations
      .filter((participation) =>
        participation.study.some((study) => study.user._id === userInfo._id),
      )
      .map((participation) => participation.date);
  }, [studySet?.participations, userInfo?._id]);

  const isDateReady = !!beforeMyDates && !isStudySetLoading;

  // 이미 신청해 둔 날짜의 기존 시간. 사용자가 직접 바꾸지 않는 한 그대로 다시 보낸다.
  const existingTimes = useMemo(() => {
    if (!studySet?.participations || !userInfo?._id) return {} as Record<string, IStudyVoteTime>;
    return Object.fromEntries(
      studySet.participations.flatMap((participation) => {
        const mine = participation.study.find((study) => study.user._id === userInfo._id);
        return mine?.times?.start && mine?.times?.end
          ? [[participation.date, { start: dayjs(mine.times.start), end: dayjs(mine.times.end) }]]
          : [];
      }),
    ) as Record<string, IStudyVoteTime>;
  }, [studySet?.participations, userInfo?._id]);

  const isChange = !!beforeMyDates?.length;

  const fallbackLocation = userInfo?.locationDetail;

  const submitVote = () => {
    const anchors = voteLocations.map((l) => ({
      latitude: l.latitude,
      longitude: l.longitude,
      locationDetail: l.address,
    }));

    const primary = anchors[0] ?? {
      latitude: fallbackLocation?.latitude,
      longitude: fallbackLocation?.longitude,
      locationDetail: getLocationSimpleText(fallbackLocation?.address),
    };

    // 날짜별 시간: 날짜별 모드면 그 값, 아니면 기존 신청 날짜의 기존 시간("모든 날짜에 적용"을
    // 누르지 않은 경우). 예전에는 공용 시간이 모든 날짜에 적용돼 기존 날짜 시간이 조용히 바뀌었다.
    // 공용 start/end는 함께 보낸다 — 서버는 dateTimes에 없는 날짜에 공용 값을 쓴다.
    const perDateTimes: Record<string, IStudyVoteTime> = {
      ...(Object.keys(dateTimes).length ? dateTimes : applyToExisting ? {} : existingTimes),
    };
    // 오늘 9시 이후(확정된 날짜)는 무슨 일이 있어도 기존 시간 그대로 보낸다 — 확정 뒤 변경은 상세에서 한다.
    const lockedToday = getHour() >= STUDY_RESULT_HOUR ? dayjsToStr(dayjs()) : null;
    if (lockedToday && existingTimes[lockedToday]) {
      perDateTimes[lockedToday] = existingTimes[lockedToday];
    }
    const splitDates = Object.keys(perDateTimes).filter((date) => selectedDates.includes(date));

    const fallbackTime = voteTime;

    voteDateArr({
      ...primary,
      start: fallbackTime.start,
      end: fallbackTime.end,
      eps: isLocation ? 1 : (RANGE_TO_EPS[rangeNum] ?? RANGE_TO_EPS[DEFAULT_RANGE_NUM]),
      anchors: anchors.length ? anchors : [primary],
      ...(splitDates.length && {
        dateTimes: splitDates.map((date) => ({
          date,
          start: perDateTimes[date].start,
          end: perDateTimes[date].end,
        })),
      }),
    });
  };

  const handleGuestRedirect = () => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        guest: "on",
      },
    });
  };

  // 게스트는 드로어를 여는 시점에 안내한다. 예전에는 날짜·기준 위치·시간을 다 채우고
  // 마지막 "신청 완료"에서야 게스트 안내로 빠져서, 입력이 전부 버려졌다.
  // useCheckGuest는 유저 정보 로딩 중 undefined를 주므로 true일 때만 움직인다.
  useEffect(() => {
    if (isGuest !== true) return;

    handleGuestRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuest]);

  const handleBottomNav = () => {
    if (!isDateReady) {
      toast("warning", "신청 정보를 불러오는 중이에요");
      return;
    }

    if (!selectedDates.length) {
      // 기존 신청을 전부 해제한 것이므로 곧 취소다.
      if (beforeMyDates.length) {
        setIsModal(true);
        return;
      }

      toast("warning", "날짜를 선택해 주세요");
      return;
    }

    if (isGuest) {
      handleGuestRedirect();
      return;
    }

    submitVote();
  };

  const handlePickAnchor = (place: LocationProps) => {
    if (editingAnchorIndex === null) return;

    if (place?.latitude == null || place?.longitude == null) {
      toast("warning", "정확한 장소를 선택해 주세요");
      return;
    }

    const isNewAnchor = editingAnchorIndex >= voteLocations.length;

    if (isNewAnchor) {
      const isOverlapping = voteLocations.some((anchor) => {
        const distance = getDistanceFromLatLonInKm(
          anchor.latitude,
          anchor.longitude,
          place.latitude,
          place.longitude,
        );
        return distance != null && distance <= OVERLAP_WARNING_KM;
      });

      if (isOverlapping) {
        toast("info", "이미 기존 기준 위치의 범위 안에 있어요");
      }
    }

    hasEditedAnchorsRef.current = true;
    setVoteLocations((old) => {
      const next = [...old];
      next[editingAnchorIndex] = place;
      return next.slice(0, MAX_ANCHOR_COUNT);
    });
    setEditingAnchorIndex(null);
  };

  const handleRemoveAnchor = (index: number) => {
    hasEditedAnchorsRef.current = true;
    setVoteLocations((old) => old.filter((_, i) => i !== index));
  };

  // 날짜별로 묶인 채로 넘긴다. 자식이 선택한 날짜만 골라 인원을 센다.
  const nearbyParticipations = useMemo(
    () => studySet?.participations ?? [],
    [studySet?.participations],
  );

  // 위치 정보가 없는 회원도 취소할 수 있어야 한다(예전에는 locationDetail을 바로 읽다 터졌다).
  const handleCancelStudy = () => {
    setSelectedDates([]);

    voteDateArr({
      locationDetail: location
        ? location.address
        : getLocationSimpleText(userInfo?.locationDetail?.address),
      latitude: location ? location.latitude : userInfo?.locationDetail?.latitude,
      longitude: location ? location.longitude : userInfo?.locationDetail?.longitude,
      start: dayjs(),
      end: dayjs(),
      eps: 2,
    });
  };

  // 제출 전 확인 한 줄: 날짜 · 위치 · 시간.
  const summaryDates = [...selectedDates]
    .sort()
    .map((date) => dayjsToFormat(dayjs(date), "M/D(ddd)"))
    .join(", ");
  const firstPlace = voteLocations[0]?.name?.split(" ")?.[0];
  const summaryPlace =
    firstPlace && voteLocations.length > 1
      ? `${firstPlace} 외 ${voteLocations.length - 1}곳`
      : firstPlace;
  // 오늘 9시 전에 오늘을 신청하면 곧바로 확정된다는 걸 알려 준다.
  const isTodayImminent =
    getHour() < STUDY_RESULT_HOUR && selectedDates.includes(dayjsToStr(dayjs()));
  // 기존 신청 날짜를 유지하는 기본 상태에서는 공용 시간만 쓰면 실제 제출값과 달라 보인다.
  const keepsExisting =
    !Object.keys(dateTimes).length &&
    !applyToExisting &&
    selectedDates.some((date) => existingTimes[date]);
  const summaryTime = Object.keys(dateTimes).length
    ? "날짜별 시간"
    : `${formatTimeRange(voteTime)}${keepsExisting ? " (신청했던 날짜는 기존 시간)" : ""}`;

  const bottomText =
    !selectedDates.length && isChange ? "신청 취소" : isChange ? "변경하기" : "신청하기";

  return (
    <>
      <RightDrawer title={isChange ? "신청 변경" : "스터디 신청"} onClose={onClose}>
        <Flex direction="column" h="calc(100dvh - var(--header-h))" overflow="hidden">
          <Flex flex={1} overflowY="auto" direction="column" pb={5}>
            <StudyApplySection
              selectDates={(d: string[]) => setSelectedDates(d)}
              defaultDate={defaultDate}
              selectedDates={selectedDates}
              beforeMyDates={beforeMyDates}
              rangeNum={rangeNum}
              changeRangeNum={setRangeNum}
              voteLocations={voteLocations}
              nearbyParticipations={nearbyParticipations}
              isLocation={isLocation}
              onEditAnchor={setEditingAnchorIndex}
              onRemoveAnchor={handleRemoveAnchor}
              myId={userInfo?._id}
            />
            {selectedDates.length > 0 && (
              <Box mt={5}>
                <StudyApplyTimeSection
                  selectedDates={selectedDates}
                  preset={timePreset}
                  commonTime={voteTime}
                  onChangeCommon={(preset, time) => {
                    setTimePreset(preset);
                    setVoteTime(time);
                  }}
                  dateTimes={dateTimes}
                  setDateTimes={setDateTimes}
                  existingTimes={existingTimes}
                  applyToExisting={applyToExisting}
                  setApplyToExisting={setApplyToExisting}
                  lockedDate={getHour() >= STUDY_RESULT_HOUR ? dayjsToStr(dayjs()) : null}
                />
              </Box>
            )}
            {selectedDates.length > 0 && (
              <Box mt={5} p={3} bg="gray.50" borderRadius="10px" fontSize="12px" lineHeight="18px">
                <Box fontWeight={600} color="gray.800">
                  {summaryDates}
                  {summaryPlace ? ` · ${summaryPlace} 기준` : ""} · {summaryTime}
                </Box>
                <Box mt={1} color="gray.500">
                  당일 오전 9시, 가까운 멤버가 4명 이상 모이면 확정돼요. <br />
                  확정 후 당일 불참 시에는 포인트가 차감됩니다.
                  {isTodayImminent && " 오늘 신청은 오전 9시에 바로 확정돼요."}
                </Box>
              </Box>
            )}
            {onOpenStudy && (
              <Box
                as="button"
                type="button"
                mt={6}
                mx="auto"
                py={2}
                fontSize="12px"
                color="gray.500"
                textDecoration="underline"
                onClick={onOpenStudy}
              >
                갈 카페와 시간이 정해져 있다면? 직접 스터디 열기
              </Box>
            )}
          </Flex>
          <BottomNav
            isSlide={false}
            text={bottomText}
            onClick={handleBottomNav}
            isLoading={!isDateReady || isLoading}
          />
        </Flex>
      </RightDrawer>
      {isModal && (
        <StudyCancelModal
          onClose={() => setIsModal(false)}
          handleCancel={handleCancelStudy}
          isLoading={isLoading}
        />
      )}
      {editingAnchorIndex !== null && (
        <PlaceDrawer
          defaultLocation={voteLocations[editingAnchorIndex] ?? voteLocations[0]}
          setVoteLocation={handlePickAnchor}
          onClose={() => setEditingAnchorIndex(null)}
        />
      )}
    </>
  );
}

export default StudyApplyDrawer;
