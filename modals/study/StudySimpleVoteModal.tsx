import { Box } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import PlaceSelector from "../../components/atoms/PlaceSelector";
import ImageTileFlexLayout from "../../components/molecules/layouts/ImageTileFlexLayout";
import { IImageTileData } from "../../components/molecules/layouts/ImageTitleGridLayout";
import { StudyVoteTimeRullets } from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { STUDY_CHECK_POP_UP } from "../../constants/keys/localStorage";
import { POINT_SYSTEM_PLUS } from "../../constants/serviceConstants/pointSystemConstants";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import {
  useStudyOpenFreeMutation,
  useStudyParticipationMutation,
} from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { usePointSystemLogQuery } from "../../hooks/user/queries";
import { myStudyInfoState } from "../../recoils/studyRecoils";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IParticipation } from "../../types/models/studyTypes/studyDetails";
import { IStudyVote } from "../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

interface StudySimpleVoteModalProps extends IModal {
  studyVoteData: IParticipation[];
}

function StudySimpleVoteModal({ studyVoteData, setIsModal }: StudySimpleVoteModalProps) {
  const toast = useToast();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const resetStudy = useResetStudyQuery();
  const myStudy = useRecoilValue(myStudyInfoState);
  const [selectedPlace, setSelectedPlace] = useState<string>();
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [myVote, setMyVote] = useState<IStudyVote>();
  const [voteTime, setVoteTime] = useState<{ start: Dayjs; end: Dayjs }>();

  const { data: pointLog } = usePointSystemLogQuery("point", true, {
    enabled: !!myStudy,
  });
  const { mutate: getPoint } = usePointSystemMutation("point");

  const { mutateAsync: openFree, isLoading: isLoading2 } = useStudyOpenFreeMutation(date, {});

  const { mutate: patchAttend, isLoading } = useStudyParticipationMutation(dayjs(date), "post", {
    onSuccess() {
      handleSuccess();
    },
  });

  useEffect(() => {
    setMyVote((old) => ({
      ...old,
      place: selectedPlace,
      start: voteTime?.start,
      end: voteTime?.end,
    }));
  }, [selectedPlace, voteTime]);

  const handleSuccess = async () => {
    resetStudy();
    if (myPrevVotePoint) {
      await getPoint({
        message: "스터디 투표 취소",
        value: -myPrevVotePoint,
      });
    }
    await getPoint({
      ...POINT_SYSTEM_PLUS.STUDY_VOTE_DAILY,
      sub: date,
    });
    toast(
      "success",
      `참여 완료! ${POINT_SYSTEM_PLUS.STUDY_VOTE_DAILY.value} 포인트가 적립되었습니다."}`,
    );
    setIsModal(false);
  };

  const myPrevVotePoint = pointLog?.find(
    (item) => item.message === "스터디 투표" && item.meta.sub === dayjsToStr(dayjs(date)),
  )?.meta.value;

  const handleVote = async () => {
    if (!myVote?.place || !myVote?.start || !myVote?.end) {
      toast("error", "누락된 정보가 있습니다.");
      return;
    }
    const findPlace = studyVoteData?.find((par) => par.place._id === myVote.place);

    if (findPlace.status === "dismissed") {
      await openFree(myVote?.place);
      setTimeout(() => {
        patchAttend(myVote);
      }, 500);
    } else patchAttend(myVote);
  };

  const hasDismissedStudy = localStorage.getItem(STUDY_CHECK_POP_UP) === dayjsToStr(dayjs());

  const imageDataArr: IImageTileData[] = studyVoteData
    ?.filter((par) => par.status !== "dismissed")
    .map((par) => ({
      imageUrl: par.place.image,
      text: par.place.branch,
      id: par.place._id,
      func: () => {
        if (par.place.branch === "개인 스터디" && !hasDismissedStudy) {
          toast("warning", "사전 투표 인원만 참여가 가능합니다.");
          return;
        }
        setSelectedPlace(par.place._id);
      },
    }))
    .sort((a) => (a.text === "개인 스터디" ? 1 : -1));

  const dismissedPlaces = studyVoteData?.filter((par) => par.status === "dismissed");

  const handleFirstPage = () => {
    if (!selectedPlace) {
      toast("warning", "선택된 장소가 없습니다.");
      return;
    }
    setIsFirstPage(false);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: isFirstPage ? "다음" : "참여 신청",
      func: isFirstPage ? handleFirstPage : handleVote,
      isLoading: isLoading || isLoading2,
    },
    sub: {
      text: isFirstPage ? "닫기" : "이전",
      func: isFirstPage ? () => setIsModal(false) : () => setIsFirstPage(true),
    },
  };

  return (
    <ModalLayout title="당일 참여 신청" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Box>
        {isFirstPage ? (
          <>
            <ModalSubtitle>
              오픈된 스터디에 참여하거나 자유 스터디로 오픈할 수 있습니다.
            </ModalSubtitle>
            <ImageTileFlexLayout imageDataArr={imageDataArr} selectedId={[selectedPlace]} />
            <Box mt="20px">
              <PlaceSelector
                options={dismissedPlaces}
                defaultValue={selectedPlace}
                setValue={setSelectedPlace}
              />
            </Box>
          </>
        ) : (
          <StudyVoteTimeRullets setVoteTime={setVoteTime} />
        )}
      </Box>
    </ModalLayout>
  );
}

export default StudySimpleVoteModal;
