import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import ImageTileGridLayout, {
  IImageTileData,
} from "../../components/molecules/layouts/ImageTitleGridLayout";
import { STUDY_PREFERENCE_LOCAL } from "../../constants/keys/queryKeys";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useStudyPlacesQuery, useStudyPreferenceQuery } from "../../hooks/study/queries";
import { selectStudyPlace } from "../../libs/study/selectStudyPlace";
import { IModal } from "../../types/components/modalTypes";
import { IStudyVotePlaces } from "../../types/models/studyTypes/studyInterActions";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import { IConfirmContent } from "../common/ConfirmModal";
import ConfirmModal2 from "../common/ConfirmModal2";
import { IFooterOptions, ModalLayout } from "../Modals";

function StudyPresetModal({ setIsModal }: IModal) {
  const { data: session } = useSession();
  const toast = useToast();
  const typeToast = useTypeToast();

  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const [presetPlaces, setPresetPlaces] = useState<IStudyVotePlaces>({
    place: null,
    subPlace: [],
  });

  const location = session?.user.location;

  const { data: studyPreference } = useStudyPreferenceQuery();

  const { data: studyPlaces } = useStudyPlacesQuery(location, "active", {
    enabled: !!location,
    onSuccess(data) {
      if (data.length === 0) {
        toast("error", "등록 가능한 스터디 장소가 없습니다.");
        setIsModal(false);
      }
    },
  });

  const size =
    studyPlaces?.length > 12
      ? "xxxl"
      : studyPlaces?.length > 8
      ? "xxl"
      : studyPlaces?.length > 4
      ? "xl"
      : "md";

  useEffect(() => {
    if (!studyPreference) return;
    setPresetPlaces({
      place: studyPreference.place,
      subPlace: studyPreference?.subPlace,
    });
  }, [studyPreference]);

  const queryClient = useQueryClient();

  // const { mutate: getPoint } = usePointSystemMutation("point");

  // const onClose = () => {
  //   newSearchParams.delete("preset");
  //   const params = newSearchParams.toString();

  //   router.replace(pathname + (params ? `?${newSearchParams.toString()}` : ""));
  // };

  const onSubmit = async () => {
    const savedPlaces: IStudyVotePlaces = {
      place: presetPlaces.place,
      subPlace: presetPlaces.subPlace.filter((place) =>
        studyPlaces.map((par) => par._id).includes(place),
      ),
    };

    localStorage.setItem(
      STUDY_PREFERENCE_LOCAL,
      JSON.stringify({ prefer: savedPlaces, date: dayjsToStr(dayjs()) }),
    );

    // await getPoint({ value: 20, message: "스터디 장소 설정" });
    setIsModal(false);
  };

  const content: IConfirmContent = {
    title: "선택을 완료하시겠어요?",
    text: `선택한 2지망 개수에 따라 추가 포인트를 얻을 수 있고, 스터디 확정에 유리합니다. (현재 선택한 2지망 수: ${presetPlaces?.subPlace?.length}개)`,
    onClickRight: () => onSubmit(),
  };

  const imageDataArr: IImageTileData[] = studyPlaces?.map((placeProps) => ({
    imageUrl: placeProps.image,
    text: placeProps.branch,
    func: () => {
      const { place, subPlace } = selectStudyPlace(
        placeProps._id,
        presetPlaces?.place,
        presetPlaces?.subPlace,
      );

      setPresetPlaces((old) => ({ ...old, place, subPlace }));
    },
    id: placeProps._id,
  }));

  const footerOptions: IFooterOptions = {
    main: { text: "변경", func: () => setIsConfirmModal(true) },
    sub: {},
  };

  return (
    <>
      <ModalLayout title="스터디 프리셋 설정" footerOptions={footerOptions} setIsModal={setIsModal}>
        <Box
          h={
            size === "xxxl" ? "360px" : size === "xxl" ? "310px" : size === "xl" ? "200px" : "200px"
          }
          overflowY="auto"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE and Edge
          }}
        >
          {imageDataArr && (
            <ImageTileGridLayout
              imageDataArr={imageDataArr}
              grid={{ row: null, col: 4 }}
              selectedId={[presetPlaces?.place]}
              selectedSubId={presetPlaces?.subPlace}
            />
          )}
        </Box>
      </ModalLayout>

      {isConfirmModal && <ConfirmModal2 setIsModal={setIsConfirmModal} content={content} />}
    </>
  );
}

export default StudyPresetModal;
