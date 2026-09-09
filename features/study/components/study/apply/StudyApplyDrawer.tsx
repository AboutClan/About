import { Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import BottomNav from "@/components/layouts/BottomNav";
import { BottomFlexDrawerOptions } from "@/components/modals/drawer/BottomFlexDrawer";
import RightDrawer from "@/components/modals/drawer/RightDrawer";
import {
  DEFAULT_RANGE_NUM,
  RANGE_TO_EPS,
} from "@/constants/serviceConstants/studyConstants/studyRangeConstant";
import { StudyCancelModal } from "@/features/study/components/study/apply/ui/overlay/CancelModal";
import { PlaceDrawer } from "@/features/study/components/study/apply/ui/overlay/PlaceDrawer";
import StudyApplySection, {
  MAX_ANCHOR_COUNT,
} from "@/features/study/components/study/apply/ui/StudyApplySection";
import StudyVoteTimeRulletDrawer from "@/features/study/components/studyVote/StudyVoteTimeRulletDrawer";
import { useStudyVoteArrMutation } from "@/features/study/hooks/mutations";
import { useStudySetQuery } from "@/features/study/hooks/queries";
import { useResetStudyQuery } from "@/features/study/hooks/useResetStudyQuery";
import { useUserInfoQuery } from "@/features/user/hooks/queries";
import { useToast } from "@/hooks/custom/CustomToast";
import { useCheckGuest } from "@/hooks/custom/UserHooks";
import { LocationProps } from "@/types/common";
import { IStudyVoteTime } from "@/types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "@/utils/dateTimeUtils";
import { getDistanceFromLatLonInKm } from "@/utils/mathUtils";
import { getLocationSimpleText } from "@/utils/stringUtils";

interface StudyDateDrawerProps {
  onClose: () => void;
  defaultDate?: string;
  location?: LocationProps;
  canChange?: boolean;
  isLocation?: boolean;
}

const PRELOAD_IMAGE_SRCS = ["/icons/lunch.png", "/icons/dinner.png", "/icons/selectIcon.png"];

// 기준점끼리 이 거리 안에 있으면 범위가 사실상 겹친다고 보고 안내한다(막지는 않는다).
// 반경 1단계의 안쪽 원(2km) 기준.
const OVERLAP_WARNING_KM = 2;

function preloadImages(srcList: string[]) {
  srcList.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function StudyApplyDrawer({
  onClose,
  defaultDate,
  location,
  canChange = false,
  isLocation,
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
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeDrawer, setIsTimeDrawer] = useState(false);

  const { data: userInfo } = useUserInfoQuery();
  const { data: studySet, isLoading: isStudySetLoading } = useStudySetQuery(dayjsToStr(dayjs()));

  const { mutate: voteDateArr, isLoading } = useStudyVoteArrMutation(selectedDates, {
    onSuccess() {
      if (selectedDates.length) {
        toast("success", canChange ? "스터디 변경 완료!" : "스터디 신청 완료!");
      } else {
        toast("success", "스터디 취소 완료!");
      }

      resetStudy();
      onClose();
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

  useEffect(() => {
    preloadImages(PRELOAD_IMAGE_SRCS);
  }, []);

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

    voteDateArr({
      ...primary,
      start: voteTime.start,
      end: voteTime.end,
      eps: isLocation ? 1 : (RANGE_TO_EPS[rangeNum] ?? RANGE_TO_EPS[DEFAULT_RANGE_NUM]),
      anchors: anchors.length ? anchors : [primary],
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

    setIsTimeDrawer(true);
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

  const drawerOptions: BottomFlexDrawerOptions = {
    header: {
      title: "예상 참여 시간을 선택해 주세요",
      subTitle: "스터디 전까지 언제든 변경할 수 있습니다.",
    },
    footer: {
      text: "신청 완료",
      func: () => {
        if (isGuest) {
          handleGuestRedirect();
          return;
        }

        submitVote();
      },
      loading: isLoading,
    },
  };

  const handleCancelStudy = async () => {
    await setSelectedDates([]);

    voteDateArr({
      locationDetail: location
        ? location.address
        : getLocationSimpleText(userInfo.locationDetail.address),
      latitude: location ? location.latitude : userInfo.locationDetail.latitude,
      longitude: location ? location.longitude : userInfo.locationDetail.longitude,
      start: dayjs(),
      end: dayjs(),
      eps: 2,
    });
  };

  return (
    <>
      <RightDrawer title="스터디 신청" onClose={onClose}>
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
            />
          </Flex>
          <BottomNav
            isSlide={false}
            text="시간 선택하기"
            onClick={handleBottomNav}
            isLoading={!isDateReady}
          />
        </Flex>
      </RightDrawer>
      {isTimeDrawer && (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsTimeDrawer}
        />
      )}
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
