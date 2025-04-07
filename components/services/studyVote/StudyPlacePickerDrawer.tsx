export const Temp = () => null;

// import { Box, Flex } from "@chakra-ui/react";
// import { useEffect, useState } from "react";

// import { useUserCurrentLocation } from "../../../hooks/custom/CurrentLocationHook";
// import {
//   DEFAULT_SUB_PLACE_CNT,
//   RECOMMENDATION_KM,
//   sortByDistanceSub,
//   SubPlaceProps,
// } from "../../../pageTemplates/vote/VoteDrawer";
// import { DispatchType } from "../../../types/hooks/reactTypes";
// import {
//   StudyParticipationProps,
//   StudyVoteDataProps,
// } from "../../../types/models/studyTypes/studyDetails";
// import { StudyThumbnailCardProps } from "../../molecules/cards/StudyThumbnailCard";
// import PickerRowButton from "../../molecules/PickerRowButton";
// import BottomFlexDrawer, { BottomFlexDrawerOptions } from "../../organisms/drawer/BottomFlexDrawer";

// interface StudyPlacePickerDrawerProps {
//   studyVoteData: StudyVoteDataProps;
//   setModalType: (type: "timeSelect") => void;
//   id: string;

//   subArr: SubPlaceProps[];
//   setSubArr: DispatchType<SubPlaceProps[]>;
//   findMyPickMainPlace: StudyParticipationProps;
// }

// function StudyPlacePickerDrawer({
//   setModalType,
//   studyVoteData,
//   id,
//   subArr,
//   setSubArr,
//   findMyPickMainPlace,
// }: StudyPlacePickerDrawerProps) {
//   const { currentLocation } = useUserCurrentLocation();

//   const [defaultPlaceArr, setDefaultPlaceArr] = useState<SubPlaceProps[]>([]);

//   useEffect(() => {
//     if (!studyVoteData) return;
//     const temp: SubPlaceProps[] = [];
//     const temp2: SubPlaceProps[] = [];
//     const sortedSub = sortByDistanceSub(studyVoteData, findMyPickMainPlace);
//     sortedSub.forEach((par, idx) => {
//       if (idx < DEFAULT_SUB_PLACE_CNT && par.place.distance <= RECOMMENDATION_KM) temp.push(par);
//       else temp2.push(par);
//     });
//     setSubArr(temp);
//     setDefaultPlaceArr(temp2);
//   }, [studyVoteData]);

//   const drawerOptions2: BottomFlexDrawerOptions = {
//     header: {
//       title: "스터디 장소 투표",
//       subTitle: "참여 가능한 스터디 장소를 모두 선택해 주세요¡",
//     },
//     footer: {
//       text: "다 음",
//       func: () => setModalType("timeSelect"),
//       // loading: isLoading1 || isLoading2,
//     },
//   };

//   const convertData = (data: StudyParticipationProps): StudyThumbnailCardProps => {
//     const isMain = id === data.place._id;
//     return setStudyThumbnailCard(
//       [data],
//       null,
//       isMain
//         ? currentLocation
//         : { lat: findMyPickMainPlace?.place.latitude, lon: findMyPickMainPlace?.place?.longitude },
//       null,
//       true,
//       null,
//       null,
//       null,
//     )[0];
//   };

//   return (
//     <>
//       <BottomFlexDrawer
//         isOverlay
//         isHideBottom
//         isDrawerUp
//         zIndex={5000}
//         height={410}
//         setIsModal={() => setModalType(null)}
//         drawerOptions={drawerOptions2}
//       >
//         <Flex w="full" direction="column" overflowY="scroll">
//           <Box mb={2} w="full">
//             <PickerRowButton
//               {...convertData(findMyPickMainPlace)}
//               onClick={() => setModalType(null)}
//               pickType="main"
//             />
//           </Box>
//           {subArr?.map((props, idx) => {
//             const id = props.place._id;
//             const par = defaultPlaceArr.find((par) => par.place._id === id);
//             return (
//               <Box key={idx} mb={2} w="full">
//                 <PickerRowButton
//                   {...convertData(props)}
//                   onClick={() =>
//                     subArr.some((sub) => sub.place._id === id)
//                       ? setSubArr((old) => old.filter((old) => old.place._id !== id))
//                       : setSubArr((old) => [...old, par])
//                   }
//                   pickType="second"
//                   isNoSelect={!subArr.some((par) => par.place._id === id)}
//                 />
//               </Box>
//             );
//           })}
//           {defaultPlaceArr?.map((props, idx) => {
//             const id = props.place._id;
//             const par = defaultPlaceArr.find((par) => par.place._id === id);
//             return (
//               <Box key={idx} mb={2} w="full">
//                 <PickerRowButton
//                   {...convertData(props)}
//                   onClick={() => setSubArr((old) => [...old, par])}
//                   pickType={null}
//                   isNoSelect={!subArr.some((par) => par.place._id === id)}
//                 />
//               </Box>
//             );
//           })}
//         </Flex>
//       </BottomFlexDrawer>
//     </>
//   );
// }

// export default StudyPlacePickerDrawer;

// // import { Box } from "@chakra-ui/react";
// // import dayjs from "dayjs";
// // import { useState } from "react";

// // import { useToast } from "../../../hooks/custom/CustomToast";
// // import { IModal } from "../../../types/components/modalTypes";
// // import { IStudyVoteTime } from "../../../types/models/studyTypes/studyInterActions";
// // import ImageTileGridLayout, { IImageTileData } from "../../molecules/layouts/ImageTitleGridLayout";
// // import BottomDrawerLg, { IBottomDrawerLgOptions } from "../../organisms/drawer/BottomDrawerLg";
// // import StudyVoteTimeRulletDrawer from "./StudyVoteTimeRulletDrawer";

// // dayjs.locale("ko");

// // interface IStudyPlacePickerDrawer extends IModal {
// //   imagePropsArr: {
// //     id: string;
// //     name: string;
// //   };

// //   handleSubmit: (voteTime: IStudyVoteTime) => void;
// //   isLoading?: boolean;
// //   date?: string;
// //   hasPlace?: boolean;
// // }

// // export default function StudyPlacePickerDrawer({
// //   setIsModal,
// //   date,
// //   hasPlace,
// //   handleSubmit,
// //   isLoading,
// // }: IStudyPlacePickerDrawer) {
// //   // const { date, id } = useParams<{ date: string; id: string }>();
// //   // const router = useRouter();

// //   const toast = useToast();
// //   // const studyDateStatus = useRecoilValue(studyDateStatusState);

// //   const [isFirst, setIsFirst] = useState(true);
// //   const [imageDataArr, setImageDataArr] = useState<IImageTileData[]>();
// //   const [voteTime, setVoteTime] = useState<IStudyVoteTime>();

// //   // useEffect(() => {
// //   //   if (!studyVoteDataAll) return;

// //   //   setImageDataArr(
// //   //     studyVoteDataAll?.participations?.map((par) => {
// //   //       const placeProps = par.place;

// //   //       return {
// //   //         imageUrl: placeProps.image,
// //   //         text: placeProps.fullname,
// //   //         func: () => {
// //   //           const id = par.place._id;
// //   //           // if (studyDateStatus === "today") {
// //   //           //   setMyVote((old) => ({ ...old, place: id }));
// //   //           //   return;
// //   //           // }
// //   //           // const voteMainId = myVote?.place;
// //   //           // const voteSubIdArr = myVote?.subPlace;
// //   //           // const { place, subPlace } = selectStudyPlace(id, voteMainId, voteSubIdArr);
// //   //           // if (!voteMainId && voteSubIdArr?.length === 0) {
// //   //           //   const participations = studyVoteDataAll[0].participations;
// //   //           //   const placeInfo = participations.find((par) => par.place._id === place).place;
// //   //           //   setMyVote((old) => ({
// //   //           //     ...old,
// //   //           //     place,
// //   //           //     subPlace: selectSubPlaceAuto(placeInfo, participations),
// //   //           //   }));
// //   //           // } else setMyVote((old) => ({ ...old, place, subPlace }));
// //   //         },
// //   //         id: placeProps._id,
// //   //       };
// //   //     }),
// //   //   );
// //   // }, [studyVoteDataAll]);

// //   const onSubmit = () => {
// //     const diffHour = voteTime.end.diff(voteTime.start, "hour");
// //     if (diffHour < 2) {
// //       toast("warning", "최소 2시간은 선택되어야 합니다.");
// //       return;
// //     }
// //     const realVoteTime: IStudyVoteTime = {
// //       start: dayjs(date).hour(voteTime.start.hour()).minute(voteTime.start.minute()),
// //       end: dayjs(date).hour(voteTime.end.hour()).minute(voteTime.end.minute()),
// //     };
// //     handleSubmit({ ...realVoteTime });
// //   };

// //   const drawerOptions: IBottomDrawerLgOptions = {
// //     header: {
// //       title: dayjs(date).format("M월 D일 ddd요일"),
// //       subTitle: "스터디 참여시간을 선택해주세요!",
// //     },
// //     footer: {
// //       buttonText: isFirst && !hasPlace ? "다음" : "신청 완료",
// //       onClick: isFirst && !hasPlace ? () => setIsFirst(false) : onSubmit,
// //       buttonLoading: isLoading,
// //     },
// //   };

// //   return (
// //     <>
// //       {false ? (
// //         <StudyVoteTimeRulletDrawer
// //           setVoteTime={setVoteTime}
// //           drawerOptions={drawerOptions}
// //           setIsModal={setIsModal}
// //         />
// //       ) : (
// //         <BottomDrawerLg options={drawerOptions} setIsModal={setIsModal} isAnimation={false}>
// //           {/* <StudyVotePlacesPicker /> */}
// //           <Box height="240px" overflowY="scroll">
// //             {imageDataArr && (
// //               <ImageTileGridLayout
// //                 imageDataArr={imageDataArr}
// //                 grid={{ row: null, col: 4 }}
// //                 // selectedId={[myVote?.place]}
// //                 // selectedSubId={myVote?.subPlace}
// //               />
// //             )}
// //           </Box>
// //           {/* {!isPrivateStudy ? (
// //             <StudyVotePlacesPicker setVotePlaces={setVotePlaces} />
// //           ) : (
// //             <StudyVoteSubModalPrivate setVoteInfo={setMyVote} />
// //           )} */}
// //         </BottomDrawerLg>
// //       )}
// //     </>
// //   );
// // }
