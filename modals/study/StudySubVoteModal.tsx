import { Box } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import ImageTileGridLayout, {
  IImageTileData,
} from "../../components/molecules/layouts/ImageTitleGridLayout";
import { useStudyVoteQuery } from "../../hooks/study/queries";
import { IModal } from "../../types/components/modalTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IStudyVote } from "../../types/models/studyTypes/studyInterActions";
import { ActiveLocation } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IStudySubVoteModal extends IModal {
  subPlaces: string[];
  setMyVote: DispatchType<IStudyVote>;
  setTimeModal: () => void;
}

function StudySubVoteModal({ subPlaces, setMyVote, setTimeModal, setIsModal }: IStudySubVoteModal) {
  const searchParams = useSearchParams();

  const date = searchParams.get("date");
  const location = convertLocationLangTo(searchParams.get("location") as ActiveLocation, "kr");

  const [choices, setChoices] = useState<string[]>([]);

  const size = subPlaces?.length > 8 ? "xxl" : subPlaces?.length > 4 ? "xl" : "md";

  const onSubmit = async () => {
    setTimeModal();
    setIsModal(false);
  };

  const { data: studyVoteArr } = useStudyVoteQuery(date, location, {
    enabled: !!location && !!date,
  });
  const studyVoteData = studyVoteArr?.[0]?.participations;

  useEffect(() => {
    setMyVote((old) => ({ ...old, subPlace: choices }));
  }, [choices]);

  const imageDataArr: IImageTileData[] = studyVoteData
    ?.filter((par) => subPlaces.includes(par.place._id))
    .map((par) => ({
      imageUrl: par.place.image,
      text: par.place.branch,
      func: () => {
        if (choices?.includes(par.place._id)) {
          setChoices((old) => old.filter((place) => place !== par.place._id));
        } else {
          setChoices((old) => [...old, par.place._id]);
        }
      },
      id: par.place._id,
    }));

  const footerOptions: IFooterOptions = {
    main: {
      text: choices.length === 0 ? "괜찮아요!" : "선택 완료",
      func: onSubmit,
    },
  };

  return (
    <>
      <ModalLayout
        title="혹시... 2 지망 장소는 어떠신가요?"
        footerOptions={footerOptions}
        setIsModal={setIsModal}
      >
        <Box
          h={size === "xxl" ? "310px" : size === "xl" ? "200px" : "100px"}
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
              selectedId={[]}
              selectedSubId={choices}
            />
          )}
        </Box>
      </ModalLayout>
    </>
  );
}

export default StudySubVoteModal;
