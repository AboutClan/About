import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { useResetStudyQuery } from "../../../../hooks/custom/CustomHooks";
import { useToast } from "../../../../hooks/custom/CustomToast";
import { useCheckGuest } from "../../../../hooks/custom/UserHooks";
import { useStudyVoteArrMutation } from "../../../../hooks/study/mutations";
import { useStudySetQuery } from "../../../../hooks/study/queries";
import { useUserInfoQuery } from "../../../../hooks/user/queries";
import { LocationProps } from "../../../../types/common";
import { IStudyVoteTime } from "../../../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../../../utils/dateTimeUtils";
import { getLocationSimpleText } from "../../../../utils/stringUtils";
import BottomNav from "../../../layouts/BottomNav";
import { BottomFlexDrawerOptions } from "../../../organisms/drawer/BottomFlexDrawer";
import RightDrawer from "../../../organisms/drawer/RightDrawer";
import StudyVoteTimeRulletDrawer from "../../studyVote/StudyVoteTimeRulletDrawer";
import FirstPageSection from "./ui/FirstPageSection";
import { StudyCancelModal } from "./ui/overlay/CancelModal";
import { PlaceDrawer } from "./ui/overlay/PlaceDrawer";
import LocationSearch from "./ui/parts/LocationSearch";
import SecondPageSection from "./ui/SecondPageSection";

interface StudyDateDrawerProps {
  onClose: () => void;
  defaultDate?: string;
  location?: LocationProps;
  canChange?: boolean;
  isLocation?: boolean;
}

const PRELOAD_IMAGE_SRCS = ["/icons/lunch.png", "/icons/dinner.png", "/icons/selectIcon.png"];

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
  const [isStudyPlaceModal, setIsStudyPlaceModal] = useState(false);
  const [voteLocation, setVoteLocation] = useState<LocationProps>(location);
  const [rangeNum, setRangeNum] = useState<number>(2);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
  const [isTimeDrawer, setIsTimeDrawer] = useState(false);
  const [date, setDate] = useState<Dayjs>(dayjs());

  const { data: userInfo } = useUserInfoQuery();
  const { data: studySet } = useStudySetQuery(dayjsToStr(dayjs()));

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
  useEffect(() => {
    if (location) {
      setVoteLocation(location);
      return;
    }

    if (userInfo?.locationDetail) {
      setVoteLocation(userInfo.locationDetail);
    }
  }, [location, userInfo?.locationDetail]);

  useEffect(() => {
    preloadImages(PRELOAD_IMAGE_SRCS);
  }, []);

  const fallbackLocation = userInfo?.locationDetail;

  const submitVote = () => {
    voteDateArr({
      locationDetail: voteLocation
        ? voteLocation.address
        : getLocationSimpleText(fallbackLocation.address),
      latitude: voteLocation ? voteLocation.latitude : fallbackLocation.latitude,
      longitude: voteLocation ? voteLocation.longitude : fallbackLocation.longitude,
      start: voteTime.start,
      end: voteTime.end,
      eps: isLocation ? 1 : rangeNum + 1,
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
    if (!selectedDates.length) {
      if (canChange) {
        setIsModal(true);
        return;
      }

      toast("warning", "날짜를 선택해 주세요");
      return;
    }

    if (isLocation || !isFirstPage) {
      setIsTimeDrawer(true);
      return;
    }

    setIsFirstPage(false);
  };

  const beforeMyDates = useMemo(
    () =>
      studySet?.participations
        ?.filter((participation) =>
          participation.study.some((study) => study.user._id === userInfo?._id),
        )
        .map((participation) => participation.date),
    [studySet?.participations, userInfo?._id],
  );

  const participants = useMemo(
    () =>
      studySet?.participations.flatMap((participation) =>
        participation.study.map((s) => s.user?.belong),
      ) ?? [],
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
      <RightDrawer
        title=""
        onClose={() => (isFirstPage ? onClose() : setIsFirstPage(true))}
        headerBtn={
          <LocationSearch
            defaultLocation={location}
            changeVoteLocation={setVoteLocation}
            text={voteLocation?.name?.split(" ")?.[0]}
            handleClick={() => setIsStudyPlaceModal(true)}
          />
        }
      >
        {isFirstPage ? (
          <FirstPageSection
            date={date}
            changeDate={setDate}
            canChange={canChange}
            selectDates={(d: string[]) => setSelectedDates(d)}
            defaultDate={defaultDate}
            selectedDates={selectedDates}
            beforeMyDates={beforeMyDates}
          />
        ) : (
          <SecondPageSection
            rangeNum={rangeNum}
            changeRangeNum={setRangeNum}
            voteLocation={voteLocation}
            participants={participants}
              pickLocation={setVoteLocation}
              defaultLocation={location}
          />
        )}
        <BottomNav isSlide={false} text="다 음" onClick={handleBottomNav} />
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
      {isStudyPlaceModal && (
        <PlaceDrawer
          defaultLocation={voteLocation}
          setVoteLocation={setVoteLocation}
          onClose={() => setIsStudyPlaceModal(false)}
        />
      )}
    </>
  );
}

export default StudyApplyDrawer;
