import { Button } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import { STUDY_VOTE, STUDY_VOTE_CNT } from "../../../constants/keys/queryKeys";
import { PointSystemProp } from "../../../constants/serviceConstants/pointSystemConstants";
import { useToast, useTypeToast } from "../../../hooks/custom/CustomToast";
import { useStudyParticipationMutation } from "../../../hooks/study/mutations";
import { usePointSystemMutation } from "../../../hooks/user/mutations";
import { usePointSystemLogQuery } from "../../../hooks/user/queries";
import StudySubVoteModal from "../../../modals/study/StudySubVoteModal";
import { slideDirectionState } from "../../../recoils/navigationRecoils";
import { myStudyState, studyDateStatusState } from "../../../recoils/studyRecoils";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { IStudyVote } from "../../../types/models/studyTypes/studyInterActions";
import { LocationEn } from "../../../types/services/locationTypes";
import { convertLocationLangTo } from "../../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
import AlertModal, { IAlertModalOptions } from "../../AlertModal";
import { IBottomDrawerLgOptions } from "../../organisms/drawer/BottomDrawerLg";
import StudyVoteTimeRulletDrawer from "./StudyVoteTimeRulletDrawer";

interface IMapBottomNav {
  myVote: IStudyVote;
  voteScore: PointSystemProp;
  setMyVote: DispatchType<IStudyVote>;
  morePlaces: string[];
}

function MapBottomNav({ morePlaces, myVote, voteScore, setMyVote }: IMapBottomNav) {
  const router = useRouter();
  const toast = useToast();
  const typeToast = useTypeToast();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const date = searchParams.get("date");
  const location = searchParams.get("location") as LocationEn;
  const studyDateStatus = useRecoilValue(studyDateStatusState);
  const myStudy = useRecoilValue(myStudyState);

  const setSlideDirection = useSetRecoilState(slideDirectionState);

  const [isSubVoteModal, setIsSubVoteModal] = useState(false);

  const [voteTime, setVoteTime] = useState<{ start: Dayjs; end: Dayjs }>();
  const [modalType, setModalType] = useState<"timePick" | "voteCancel">(null);

  const moveToLink = () => {
    setSlideDirection(null);
    router.push(`/home?${newSearchParams.toString()}`);
  };

  const onClickTimeSelect = () => {
    if (!myVote?.place) {
      toast("error", "장소를 먼저 선택해주세요!");
      return;
    }
    if (!myVote?.subPlace?.length && studyDateStatus === "not passed") {
      setIsSubVoteModal(true);
      return;
    }
    setModalType("timePick");
  };

  const queryClient = useQueryClient();

  const { data: pointLog } = usePointSystemLogQuery("point", true, {
    enabled: !!myStudy,
  });

  //오늘 날짜 투표 포인트 받은거 찾기
  const myPrevVotePoint = pointLog?.find(
    (item) => item.message === "스터디 투표" && item.meta.sub === dayjsToStr(dayjs(date)),
  )?.meta.value;

  const { mutate: getPoint } = usePointSystemMutation("point");
  const { mutate: studyVote, isLoading } = useStudyParticipationMutation(dayjs(date), "post", {
    onSuccess() {
      handleSuccess();
    },
  });
  const { mutate: handleAbsent } = useStudyParticipationMutation(dayjs(date), "delete", {
    onSuccess() {
      queryClient.refetchQueries([STUDY_VOTE, date, convertLocationLangTo(location, "kr")]);
      if (myPrevVotePoint) {
        getPoint({
          message: "스터디 투표 취소",
          value: -myPrevVotePoint,
        });
      }
      moveToLink();
      toast("success", "취소되었습니다.");
    },
    onError: () => typeToast("error"),
  });

  const handleSuccess = () => {
    queryClient.refetchQueries([STUDY_VOTE, date, convertLocationLangTo(location, "kr")]);
    queryClient.refetchQueries([
      [STUDY_VOTE_CNT, location, dayjs(date).startOf("month"), dayjs(date).endOf("month")],
    ]);
    if (myPrevVotePoint) {
      getPoint({
        message: "스터디 투표 취소",
        value: -myPrevVotePoint,
      });
    }
    if (studyDateStatus === "not passed" && voteScore) {
      getPoint({
        ...voteScore,
        sub: date,
      });
      toast("success", `투표 완료! ${!myStudy ? "포인트가 적립되었습니다." : ""}`);
    } else toast("success", "투표 완료!");

    moveToLink();
  };

  const onSubmit = () => {
    studyVote({
      ...myVote,
      ...voteTime,
    });
    setTimeout(() => {
      moveToLink();
    }, 1000);
  };

  const drawerOptions: IBottomDrawerLgOptions = {
    header: {
      title: dayjs().format("M월 DD일 ddd요일"),
      subTitle: "스터디 참여시간을 선택해주세요!",
    },
    footer: {
      buttonText: "선택 완료",
      onClick: onSubmit,
      buttonLoading: isLoading,
    },
  };

  const alertOptions: IAlertModalOptions = {
    title: "참여 취소",
    subTitle: "스터디 신청을 취소하시겠습니까?",
    func: () => handleAbsent(),
  };

  return (
    <>
      <Layout>
        <Button colorScheme="mintTheme" size="lg" onClick={onClickTimeSelect}>
          시간 선택
        </Button>
        {myStudy && (
          <Button
            bgColor="red.400"
            color="white"
            size="lg"
            onClick={() => setModalType("voteCancel")}
            mt="8px"
          >
            참여 취소
          </Button>
        )}
        <Button mt="8px" size="lg" onClick={moveToLink}>
          닫기
        </Button>
      </Layout>
      <AnimatePresence>
        {modalType === "timePick" && (
          <StudyVoteTimeRulletDrawer
            drawerOptions={drawerOptions}
            setIsModal={() => setModalType(null)}
            setVoteTime={setVoteTime}
          />
        )}
        {modalType === "voteCancel" && (
          <AlertModal
            options={alertOptions}
            setIsModal={() => setModalType(null)}
            colorType="redTheme"
          />
        )}
      </AnimatePresence>
      {isSubVoteModal && (
        <StudySubVoteModal
          setMyVote={setMyVote}
          subPlaces={morePlaces}
          setIsModal={setIsSubVoteModal}
          setTimeModal={() => setModalType("timePick")}
        />
      )}
    </>
  );
}

const Layout = styled.div`
  display: flex;

  flex-direction: column;
  align-items: center;
  padding: 16px;
  > button {
    width: 100%;
    max-width: var(--view-max-width);
  }
`;

export default MapBottomNav;
