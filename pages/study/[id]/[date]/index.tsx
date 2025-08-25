import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { STUDY_COVER_IMAGES } from "../../../../assets/images/studyCover";
import { MainLoading } from "../../../../components/atoms/loaders/MainLoading";
import Slide from "../../../../components/layouts/PageSlide";
import { useUserInfo } from "../../../../hooks/custom/UserHooks";
import { useStudyPassedDayQuery, useStudySetQuery } from "../../../../hooks/study/queries";
import { shortenParticipations } from "../../../../libs/study/studyConverters";
import { getMyStudyDateArr } from "../../../../libs/study/studyHelpers";
import { ModalLayout } from "../../../../modals/Modals";
import StudyAddressMap from "../../../../pageTemplates/study/StudyAddressMap";
import StudyCover from "../../../../pageTemplates/study/StudyCover";
import StudyDateBar from "../../../../pageTemplates/study/StudyDateBar";
import StudyHeader from "../../../../pageTemplates/study/StudyHeader";
import StudyMembers from "../../../../pageTemplates/study/StudyMembers";
import StudyNavigation from "../../../../pageTemplates/study/StudyNavigation";
import StudyOverview from "../../../../pageTemplates/study/StudyOverView";
import StudyReviewButton from "../../../../pageTemplates/study/StudyReviewButton";
import StudyTimeBoard from "../../../../pageTemplates/study/StudyTimeBoard";
import {
  MyStudyStatus,
  StudyConfirmedMemberProps,
} from "../../../../types/models/studyTypes/study-entity.types";
import {
  StudyConfirmedSetProps,
  StudyParticipationsSetProps,
  StudyType,
} from "../../../../types/models/studyTypes/study-set.types";
import { dayjsToStr } from "../../../../utils/dateTimeUtils";
import { getRandomImage } from "../../../../utils/imageUtils";
import { navigateExternalLink } from "../../../../utils/navigateUtils";

export default function Page() {
  const searchParams = useSearchParams();
  const { id, date } = useParams<{ id: string; date: string }>() || {};
  const userInfo = useUserInfo();
  const isPassedDate = !!date && dayjs(date).startOf("day").isBefore(dayjs().startOf("day"));

  const studyType = searchParams.get("type") as StudyType;

  const { data: studySet } = useStudySetQuery(date, { enabled: !!date && !isPassedDate });
  const { data: studyPassedData } = useStudyPassedDayQuery(date, {
    enabled: !!isPassedDate,
  });

  const [modalType, setModalType] = useState<"studyLink" | "review">();

  const studyData = isPassedDate
    ? studyPassedData && studyPassedData[studyType]
    : studySet && studySet[studyType];
  console.log("set", studySet);
  const participationsSet =
    studyType === "participations" && (studyData as StudyParticipationsSetProps[]);
  const confirmedSet = studyType !== "participations" && (studyData as StudyConfirmedSetProps[]);

  const findStudy =
    studyType !== "participations" &&
    confirmedSet?.find((set) => set.study.place._id === id)?.study;

  const myStudyInfo =
    studyType === "soloRealTimes"
      ? studySet?.soloRealTimes
          ?.flatMap((solo) => solo.study)
          ?.flatMap((a) => a.members)
          ?.find((solo) => solo.user._id === userInfo?._id)
      : studyType !== "participations"
      ? findStudy?.members.find((member) => member.user._id === userInfo?._id)
      : participationsSet
          ?.find((par) => par.study.some((study) => study.user._id === userInfo?._id))
          ?.study?.filter((who) => who.user._id === userInfo?._id);

  const myStudyArr = getMyStudyDateArr(studySet, userInfo?._id);

  const findTodayStudy = myStudyArr?.find((myStudy) => myStudy.date === date);

  const myStudyStatus: MyStudyStatus = !findTodayStudy
    ? "pending"
    : findTodayStudy?.type === studyType
    ? "participation"
    : "otherParticipation";

  const members =
    studyType === "participations"
      ? shortenParticipations(participationsSet)
      : studyType === "soloRealTimes"
      ? (studyData as StudyConfirmedSetProps[])?.map((study) => ({
          ...study.study.members[0],
        }))
      : findStudy?.members;
  const placeInfo = findStudy?.place;
  console.log(9, studyData, placeInfo);

  useEffect(() => {
    if (
      myStudyStatus === "pending" ||
      studyType === "soloRealTimes" ||
      studyType === "participations" ||
      date !== dayjsToStr(dayjs())
    )
      return;
    const hasLink = localStorage.getItem("studyLink");
    if (hasLink === date) return;
    setModalType("studyLink");
  }, [myStudyStatus]);

  const isMyReview = placeInfo?.reviews?.some((review) => review.user._id === userInfo?._id);

  return (
    <>
      {studyPassedData || studySet ? (
        <>
          <StudyHeader date={date} placeInfo={placeInfo} />
          <Box mb={5}>
            <Slide isNoPadding>
              <StudyCover
                coverImage={
                  studyType === "soloRealTimes"
                    ? "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/2.%EC%8B%A4%EC%8B%9C%EA%B0%84-%EA%B3%B5%EB%B6%80-%EC%9D%B8%EC%A6%9D.png"
                    : studyType === "participations"
                    ? "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EB%8F%99%EC%95%84%EB%A6%AC/1.%EC%8A%A4%ED%84%B0%EB%94%94-%EB%A7%A4%EC%B9%AD-%EB%9D%BC%EC%9A%B4%EC%A7%80.png"
                    : placeInfo?.coverImage || getRandomImage(STUDY_COVER_IMAGES)
                }
              />
              <StudyOverview date={date} placeInfo={placeInfo} studyType={studyType} />
            </Slide>
            <Box h={2} bg="gray.100" />
            <Slide>
              {studyType !== "participations" && studyType !== "soloRealTimes" && (
                <StudyAddressMap location={placeInfo.location} />
              )}
              <StudyDateBar date={date} memberCnt={members?.length} studyType={studyType} />
              {studyType !== "participations" && studyType !== "soloRealTimes" && (
                <StudyTimeBoard members={members as StudyConfirmedMemberProps[]} />
              )}
              <Box h="1px" bg="gray.100" my={4} />
              <Box pb={2}>
                <StudyMembers date={date} members={members || []} studyType={studyType} />
              </Box>
            </Slide>
          </Box>
          {userInfo?.role !== "guest" && (
            <StudyNavigation
              myStudyInfo={myStudyInfo}
              date={date}
              id={id}
              myStudyStatus={myStudyStatus}
              studyType={studyType}
              location={placeInfo?.location}
              findStudy={findStudy}
            />
          )}
          {!isMyReview &&
            date === dayjsToStr(dayjs()) &&
            (studyType === "openRealTimes" || studyType === "results") && (
              <StudyReviewButton
                placeId={placeInfo?._id}
                myStudyInfo={myStudyInfo as StudyConfirmedMemberProps}
              />
            )}
          {/* {isInviteModal && <StudyInviteModal setIsModal={setIsInviteModal} place={place} />} */}
        </>
      ) : (
        <MainLoading />
      )}
      {modalType === "studyLink" && (
        <StudyLinkModal date={date} onClose={() => setModalType(null)} />
      )}
    </>
  );
}

function StudyLinkModal({ date, onClose }: { date: string; onClose: () => void }) {
  return (
    <ModalLayout
      title="스터디 매칭 성공!"
      footerOptions={{
        main: {
          text: "입 장",
          func: () => {
            navigateExternalLink("https://open.kakao.com/o/gCRegnOh");
            localStorage.setItem("studyLink", date);
            onClose();
          },
        },
        sub: {
          text: "생 략",
          func: () => {
            localStorage.setItem("studyLink", date);
            onClose();
          },
        },
      }}
      setIsModal={onClose}
    >
      <Flex justify="center" mb={5}>
        <Image
          width={64}
          height={64}
          alt="studyRecord"
          src="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%95%84%EC%9D%B4%EC%BD%98/falling-star-3d-icon.png"
        />
      </Flex>
      <p>
        스터디 매칭에 성공했어요! <br />
        원활한 스터디 진행을 위해, <br />
        <b>[스터디 단톡방]</b>에 입장해 주세요!
      </p>
    </ModalLayout>
  );
}
