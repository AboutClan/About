import { Box } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useRecoilValue } from "recoil";

import Selector from "../../components/atoms/Selector";
import ImageTileFlexLayout from "../../components/molecules/layouts/ImageTileFlexLayout";
import { IImageTileData } from "../../components/molecules/layouts/ImageTitleGridLayout";
import { StudyVoteTimeRullets } from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { STUDY_VOTE } from "../../constants/keys/queryKeys";
import { POINT_SYSTEM_PLUS } from "../../constants/serviceConstants/pointSystemConstants";
import { useToast } from "../../hooks/custom/CustomToast";
import {
  useStudyOpenFreeMutation,
  useStudyParticipationMutation,
} from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { usePointSystemLogQuery } from "../../hooks/user/queries";
import { myStudyState } from "../../recoils/studyRecoils";
import { ModalSubtitle } from "../../styles/layout/modal";
import { IModal } from "../../types/components/modalTypes";
import { IParticipation } from "../../types/models/studyTypes/studyDetails";
import { IStudyVote } from "../../types/models/studyTypes/studyInterActions";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

interface StudySimpleVoteModalProps extends IModal {
  studyVoteData: IParticipation[];
}

function StudySimpleVoteModal({ studyVoteData, setIsModal }: StudySimpleVoteModalProps) {
  const toast = useToast();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const locationEn = searchParams.get("location") as LocationEn;
  const location = convertLocationLangTo(locationEn, "kr");

  const myStudy = useRecoilValue(myStudyState);
  const [selectedPlace, setSelectedPlace] = useState<string>();
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [myVote, setMyVote] = useState<IStudyVote>();
  const [voteTime, setVoteTime] = useState<{ start: Dayjs; end: Dayjs }>();

  const { data: pointLog } = usePointSystemLogQuery("point", true, {
    enabled: !!myStudy,
  });
  const { mutate: getPoint } = usePointSystemMutation("point");

  const { mutateAsync: openFree } = useStudyOpenFreeMutation(date, {});

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

  const queryClient = useQueryClient();

  const handleSuccess = async () => {
    queryClient.invalidateQueries([STUDY_VOTE, date, location]);
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

  const imageDataArr: IImageTileData[] = studyVoteData
    ?.filter((par) => par.status === "dismissed")
    .map((par) => ({
      imageUrl: par.place.image,
      text: par.place.branch,
      id: par.place._id,
      func: () => setSelectedPlace(par.place._id),
    }))
    .sort((a) => (a.text === "개인 스터디" ? 1 : -1));

  const dismissedPlaces = studyVoteData
    ?.filter((par) => par.status === "dismissed")
    .map((par) => par.place.branch);

  const footerOptions: IFooterOptions = {
    main: {
      text: isFirstPage ? "선택 완료" : "참여 신청",
      func: isFirstPage ? () => setIsFirstPage(false) : handleVote,
      isLoading,
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
              <Selector
                options={["선택 없음", ...dismissedPlaces]}
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
