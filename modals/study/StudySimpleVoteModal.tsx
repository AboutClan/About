import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import ImageTileGridLayout, {
  IImageTileData,
} from "../../components/molecules/layouts/ImageTitleGridLayout";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyVoteMutation } from "../../hooks/study/mutations";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { getStudyDateStatus } from "../../libs/study/date/getStudyDateStatus";
import { recommendTodayStudyPlace } from "../../libs/study/recommendTodayStudyPlace";
import { selectStudyPlace } from "../../libs/study/selectStudyPlace";
import { selectSubPlaceAuto } from "../../libs/study/selectSubPlaceAuto";
import { IModal } from "../../types/components/modalTypes";
import { StudyParticipationProps } from "../../types/models/studyTypes/baseTypes";
import { IStudyVote } from "../../types/models/studyTypes/studyInterActions";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { IFooterOptions, ModalLayout } from "../Modals";

interface StudySimpleVoteModalProps extends IModal {
  studyVoteData: StudyParticipationProps[];
}

function StudySimpleVoteModal({ studyVoteData, setIsModal }: StudySimpleVoteModalProps) {
  const toast = useToast();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const location = searchParams.get("location");
  const locationKr = convertLocationLangTo(location as LocationEn, "kr");
  const resetStudy = useResetStudyQuery();

  const studyDateStatus = getStudyDateStatus(dateParam);

  const [isFirstPage, setIsFirstPage] = useState(true);
  const [myVote, setMyVote] = useState<IStudyVote>({
    place: null,
    subPlace: [],
    start: null,
    end: null,
  });
  const [voteTime] = useState<{ start: Dayjs; end: Dayjs }>();
  const [imageDataArr, setImageDataArr] = useState<IImageTileData[]>();
  const [recommendationPlace, setRecommendationPlace] = useState<StudyParticipationProps>();

  const { data: userInfo } = useUserInfoQuery();
  const { data: studyVoteDataAll } = useStudyVoteQuery(dateParam, locationKr, {
    enabled: !isFirstPage && !!dateParam && !!location,
  });

  const { mutate: patchAttend, isLoading } = useStudyVoteMutation(dayjs(dateParam), "post", {
    onSuccess() {
      handleSuccess();
    },
  });

  const savedPrefer = userInfo?.studyPreference;

  const mainPlaceFullName = studyVoteDataAll?.[0]?.participations?.find(
    (par) => par?.place._id === myVote?.place,
  )?.place.fullname;

  useEffect(() => {
    if (studyDateStatus !== "today" || !studyVoteData) return;
    setRecommendationPlace(recommendTodayStudyPlace(studyVoteData, userInfo?.locationDetail));
  }, [studyDateStatus, studyVoteData, userInfo?.locationDetail]);

  useEffect(() => {
    setMyVote((old) => ({ ...old, ...voteTime }));
  }, [voteTime]);

  useEffect(() => {
    if (studyDateStatus === "not passed") {
      const preferPlaces = {
        main: studyVoteData?.find((study) => study.place._id === savedPrefer.place)?.place._id,
        sub: studyVoteData
          ?.filter((study) => savedPrefer.subPlace.includes(study.place._id))
          .map((study) => study.place._id),
      };
      if (preferPlaces) {
        setMyVote((old) => ({ ...old, place: preferPlaces?.main, subPlace: preferPlaces?.sub }));
      }
    }
    if (studyDateStatus === "today") {
      if (recommendationPlace) {
        setMyVote((old) => ({ ...old, place: recommendationPlace.place._id }));
      }
    }
  }, [recommendationPlace, studyVoteData, studyDateStatus]);

  useEffect(() => {
    if (!studyVoteDataAll) return;
    setImageDataArr(
      studyVoteDataAll?.[0]?.participations?.map((par) => {
        const placeProps = par.place;
        return {
          imageUrl: placeProps.image,
          text: placeProps.fullname,
          func: () => {
            const id = par.place._id;
            if (studyDateStatus === "today") {
              setMyVote((old) => ({ ...old, place: id }));
              return;
            }
            const voteMainId = myVote?.place;
            const voteSubIdArr = myVote?.subPlace;
            const { place, subPlace } = selectStudyPlace(id, voteMainId, voteSubIdArr);
            if (!voteMainId && voteSubIdArr?.length === 0) {
              const participations = studyVoteDataAll[0].participations;
              const placeInfo = participations.find((par) => par.place._id === place).place;
              setMyVote((old) => ({
                ...old,
                place,
                subPlace: selectSubPlaceAuto(placeInfo, participations),
              }));
            } else setMyVote((old) => ({ ...old, place, subPlace }));
          },
          id: placeProps._id,
        };
      }),
    );
  }, [studyVoteDataAll, myVote]);

  const handleSuccess = async () => {
    resetStudy();

    toast("success", `참여 완료! +5 Point가 적립되었습니다}`);
    setIsModal(false);
  };

  const handleVote = async () => {
    if (!mainPlaceFullName) {
      toast("error", "누락된 정보가 있습니다.");
      return;
    }
    if (!myVote?.place || !myVote?.start || !myVote?.end) {
      toast("error", "누락된 정보가 있습니다.");
      return;
    }
    patchAttend(myVote);
  };

  const handlePlaceButton = (type: "select" | "complete") => {
    if (type === "select") setIsFirstPage(false);
    else {
      if (!myVote?.place) {
        toast("warning", "장소를 선택해 주세요");
        return;
      }
      setIsFirstPage(true);
    }
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "투표 완료",
      func: handleVote,
      isLoading: isLoading,
    },
  };

  return (
    <ModalLayout
      title={
        studyDateStatus === "today"
          ? "당일 참여 신청"
          : `${dayjsToFormat(dayjs(dateParam), "M월 D일")} 스터디 신청`
      }
      footerOptions={footerOptions}
      setIsModal={setIsModal}
    >
      <Flex justify="space-between" align="center" fontSize="16px" mb={4}>
        <Box>
          <Box fontWeight={600} as="span" mr={1}>
            {studyDateStatus === "today" ? "참여 장소" : "투표 장소"}:
          </Box>
          <Box as="span">
            {studyDateStatus === "today"
              ? mainPlaceFullName || "장소를 선택해 주세요"
              : mainPlaceFullName
              ? `${mainPlaceFullName} 외 ${myVote?.subPlace?.length + 1}곳`
              : "등록된 장소가 없습니다."}
          </Box>
        </Box>
        <Button
          size="sm"
          colorScheme="mint"
          onClick={() => handlePlaceButton(isFirstPage ? "select" : "complete")}
        >
          {isFirstPage ? "직접 선택" : "선택 완료"}
        </Button>
      </Flex>
      {isFirstPage ? (
        <Box>
          {/* <ImageTileFlexLayout imageDataArr={imageDataArr} selectedId={[selectedPlace]} /> */}
          {/* <Box mt="20px">
              <PlaceSelector
                options={dismissedPlaces}
                defaultValue={selectedPlace}
                setValue={setSelectedPlace}
              />
            </Box> */}
          {/* <StudyVoteTimeRullets setVoteTime={setVoteTime} /> */}
        </Box>
      ) : imageDataArr ? (
        <Box height="240px" overflowY="scroll">
          <ImageTileGridLayout
            imageDataArr={imageDataArr}
            grid={{ row: null, col: 4 }}
            selectedId={[myVote?.place]}
            selectedSubId={myVote?.subPlace}
          />
        </Box>
      ) : (
        <MainLoadingAbsolute />
      )}
    </ModalLayout>
  );
}

export default StudySimpleVoteModal;
