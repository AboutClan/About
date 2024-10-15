import { Box } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import { useToast } from "../../../hooks/custom/CustomToast";
import { IModal } from "../../../types/components/modalTypes";
import { IStudyVoteTime } from "../../../types/models/studyTypes/studyInterActions";
import ImageTileGridLayout, { IImageTileData } from "../../molecules/layouts/ImageTitleGridLayout";
import BottomDrawerLg, { IBottomDrawerLgOptions } from "../../organisms/drawer/BottomDrawerLg";
import StudyVoteTimeRulletDrawer from "./StudyVoteTimeRulletDrawer";

dayjs.locale("ko");

interface IStudyVoteDrawer extends IModal {
  imagePropsArr: {
    id: string;
    name: string;
  };

  handleSubmit: (voteTime: IStudyVoteTime) => void;
  isLoading?: boolean;
  date?: string;
  hasPlace?: boolean;
}

export default function StudyVoteDrawer({
  setIsModal,
  date,
  hasPlace,
  handleSubmit,
  isLoading,
}: IStudyVoteDrawer) {
  // const { date, id } = useParams<{ date: string; id: string }>();
  // const router = useRouter();

  const toast = useToast();
  // const studyDateStatus = useRecoilValue(studyDateStatusState);

  const [isFirst, setIsFirst] = useState(true);
  const [imageDataArr, setImageDataArr] = useState<IImageTileData[]>();
  const [voteTime, setVoteTime] = useState<IStudyVoteTime>();

  // useEffect(() => {
  //   if (!studyVoteDataAll) return;

  //   setImageDataArr(
  //     studyVoteDataAll?.participations?.map((par) => {
  //       const placeProps = par.place;

  //       return {
  //         imageUrl: placeProps.image,
  //         text: placeProps.fullname,
  //         func: () => {
  //           const id = par.place._id;
  //           // if (studyDateStatus === "today") {
  //           //   setMyVote((old) => ({ ...old, place: id }));
  //           //   return;
  //           // }
  //           // const voteMainId = myVote?.place;
  //           // const voteSubIdArr = myVote?.subPlace;
  //           // const { place, subPlace } = selectStudyPlace(id, voteMainId, voteSubIdArr);
  //           // if (!voteMainId && voteSubIdArr?.length === 0) {
  //           //   const participations = studyVoteDataAll[0].participations;
  //           //   const placeInfo = participations.find((par) => par.place._id === place).place;
  //           //   setMyVote((old) => ({
  //           //     ...old,
  //           //     place,
  //           //     subPlace: selectSubPlaceAuto(placeInfo, participations),
  //           //   }));
  //           // } else setMyVote((old) => ({ ...old, place, subPlace }));
  //         },
  //         id: placeProps._id,
  //       };
  //     }),
  //   );
  // }, [studyVoteDataAll]);

  const onSubmit = () => {
    const diffHour = voteTime.end.diff(voteTime.start, "hour");
    if (diffHour < 2) {
      toast("warning", "최소 2시간은 선택되어야 합니다.");
      return;
    }
    const realVoteTime: IStudyVoteTime = {
      start: dayjs(date).hour(voteTime.start.hour()).minute(voteTime.start.minute()),
      end: dayjs(date).hour(voteTime.end.hour()).minute(voteTime.end.minute()),
    };
    handleSubmit({ ...realVoteTime });
  };

  const drawerOptions: IBottomDrawerLgOptions = {
    header: {
      title: dayjs(date).format("M월 D일 ddd요일"),
      subTitle: "스터디 참여시간을 선택해주세요!",
    },
    footer: {
      buttonText: isFirst && !hasPlace ? "다음" : "신청 완료",
      onClick: isFirst && !hasPlace ? () => setIsFirst(false) : onSubmit,
      buttonLoading: isLoading,
    },
  };

  return (
    <>
      {false ? (
        <StudyVoteTimeRulletDrawer
          setVoteTime={setVoteTime}
          drawerOptions={drawerOptions}
          setIsModal={setIsModal}
        />
      ) : (
        <BottomDrawerLg options={drawerOptions} setIsModal={setIsModal} isAnimation={false}>
          {/* <StudyVotePlacesPicker /> */}
          <Box height="240px" overflowY="scroll">
            {imageDataArr && (
              <ImageTileGridLayout
                imageDataArr={imageDataArr}
                grid={{ row: null, col: 4 }}
                // selectedId={[myVote?.place]}
                // selectedSubId={myVote?.subPlace}
              />
            )}
          </Box>
          {/* {!isPrivateStudy ? (
            <StudyVotePlacesPicker setVotePlaces={setVotePlaces} />
          ) : (
            <StudyVoteSubModalPrivate setVoteInfo={setMyVote} />
          )} */}
        </BottomDrawerLg>
      )}
    </>
  );
}
