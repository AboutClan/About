import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { StudyVoteTimeRullets } from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";
import { POINT_SYSTEM_PLUS } from "../../constants/serviceConstants/pointSystemConstants";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import {
  useStudyOpenFreeMutation,
  useStudyParticipationMutation,
} from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { usePointSystemLogQuery, useUserInfoQuery } from "../../hooks/user/queries";
import { myStudyInfoState } from "../../recoils/studyRecoils";
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

  const { data: userInfo } = useUserInfoQuery();
  const savedPrefer = userInfo?.studyPreference;

  const preferPlaces = {
    main: studyVoteData?.find((study) => study.place._id === savedPrefer.place)?.place.fullname,
    sub: studyVoteData
      ?.filter((study) => savedPrefer.subPlace.includes(study.place._id))
      .map((study) => study.place.fullname),
  };

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

  const footerOptions: IFooterOptions = {
    main: {
      text: "투표 완료",
      func: handleVote,
      isLoading: isLoading || isLoading2,
    },
  };

  return (
    <ModalLayout title="당일 참여 신청" footerOptions={footerOptions} setIsModal={setIsModal}>
      <Box>
        <Flex justify="space-between" align="center" fontSize="16px" mb={4}>
          <Box>
            <Box fontWeight={600} as="span" mr={1}>
              투표 장소:
            </Box>
            {preferPlaces?.main} 외 {preferPlaces?.sub?.length + 1}곳
          </Box>
          <Button size="sm" colorScheme="mintTheme">
            직접 선택
          </Button>
        </Flex>
        {/* <ImageTileFlexLayout imageDataArr={imageDataArr} selectedId={[selectedPlace]} /> */}
        {/* <Box mt="20px">
              <PlaceSelector
                options={dismissedPlaces}
                defaultValue={selectedPlace}
                setValue={setSelectedPlace}
              />
            </Box> */}
        <StudyVoteTimeRullets setVoteTime={setVoteTime} />
      </Box>
    </ModalLayout>
  );
}

export default StudySimpleVoteModal;
