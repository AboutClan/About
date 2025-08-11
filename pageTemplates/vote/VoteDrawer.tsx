export function Temp() {
  return null;
}

// import { Box, Button, Flex } from "@chakra-ui/react";
// import dayjs from "dayjs";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useRecoilValue } from "recoil";

// import { STUDY_MAIN_IMAGES } from "../../assets/images/studyMain";
// import AlertModal, { IAlertModalOptions } from "../../components/AlertModal";
// import { StudyThumbnailCardProps } from "../../components/molecules/cards/StudyThumbnailCard";
// import PickerRowButton from "../../components/molecules/PickerRowButton";
// import BottomFlexDrawer, {
//   BottomFlexDrawerOptions,
// } from "../../components/organisms/drawer/BottomFlexDrawer";
// import StudyVoteTimeRulletDrawer from "../../components/services/studyVote/StudyVoteTimeRulletDrawer";
// import { LOCATION_OPEN } from "../../constants/location";
// import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
// import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
// import { useStudyVoteMutation } from "../../hooks/study/mutations";
// import { useUserInfoQuery } from "../../hooks/user/queries";
// import { convertStudyToParticipations } from "../../libs/study/getMyStudyMethods";
// import { setStudyThumbnailCard } from "../../libs/study/setStudyThumbnailCard";
// import { myStudyParticipationState } from "../../recoils/studyRecoils";
// import { CoordinatesProps } from "../../types/common";
// import { IModal } from "../../types/components/modalTypes";
// import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
// import {
//   StudyMergeParticipationProps,
//   StudyParticipationProps,
//   StudyPlaceProps,
//   StudyVoteDataProps,
// } from "../../types/models/studyTypes/studyDetails";
// import { IStudyVoteTime, MyVoteProps } from "../../types/models/studyTypes/studyInterActions";
// import { Location } from "../../types/services/locationTypes";
// import { dayjsToFormat, dayjsToStr } from "../../utils/dateTimeUtils";
// import { getDistanceFromLatLonInKm, getRandomIdx } from "../../utils/mathUtils";
// import { iPhoneNotchSize } from "../../utils/validationUtils";
// import VoteDrawerPlaceDrawer from "./voteDrawer/StudyOpenDrawer";
// export interface VoteDrawerItemProps {
//   place: StudyPlaceProps;
//   voteCnt: number;
//   favoritesCnt: number;
//   myFavorite: "first" | "second";
// }

// interface VoteDrawerProps extends IModal {
//   studyVoteData: StudyVoteDataProps;
//   location: Location;
//   date: string;

//   setCenterLocation: DispatchType<{ lat: number; lon: number }>;
//   myVote: MyVoteProps;
//   setMyVote: DispatchType<MyVoteProps>;
//   isFirstPage: boolean;
//   setIsFirstPage: DispatchBoolean;
//   setIsVoteDrawer: DispatchBoolean;
//   currentLocation: CoordinatesProps;
// }

// export const DEFAULT_SUB_PLACE_CNT = 2;
// export const RECOMMENDATION_KM = 2.2;

// function VoteDrawer({
//   studyVoteData,
//   location,
//   date,
//   setIsModal,
//   isFirstPage,
//   setIsFirstPage,
//   setCenterLocation,
//   myVote,
//   setIsVoteDrawer,
//   setMyVote,
//   currentLocation,
// }: VoteDrawerProps) {
//   const typeToast = useTypeToast();
//   const toast = useToast();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const newSearchParams = new URLSearchParams(searchParams);

//   const [thumbnailCardInfoArr, setThumbnailCardinfoArr] = useState<StudyThumbnailCardProps[]>();
//   const [isRightDrawer, setIsRightDrawer] = useState(false);
//   const [isTimeDrawer, setIsTimeDrawer] = useState(false);
//   const isTodayVote = dayjs().isSame(date, "day") && dayjs().hour() >= 9;
//   const [voteTime, setVoteTime] = useState<IStudyVoteTime>();
//   const [mergeParticipations, setMergeParticipations] = useState<StudyMergeParticipationProps[]>();
//   const [imageCache, setImageCache] = useState<Map<string, string>>(new Map());

//   const [alertModalInfo, setAlertModalInfo] = useState<IAlertModalOptions>();

//   const myStudyParticipation = useRecoilValue(myStudyParticipationState);

//   const { data: userInfo } = useUserInfoQuery();
//   const { mutate: patchAttend, isLoading } = useStudyVoteMutation(dayjs(date), "post", {
//     onSuccess() {
//       handleSuccess();
//     },
//   });

//   const preference = userInfo?.studyPreference;
//   const findMyPickMainPlace = studyVoteData?.participations.find(
//     (par) => par.place._id === myVote?.main,
//   );
//   const findMyPreferMainPlace = studyVoteData?.participations.find(
//     (par) => par.place._id === preference?.place,
//   );

//   useEffect(() => {
//     if (LOCATION_OPEN.includes(location)) return;
//     setIsRightDrawer(true);
//   }, [location]);

//   //스터디 장소 자동 선택 알고리즘
//   useEffect(() => {
//     if (!studyVoteData) return;

//     // if (isFirstPage && !currentLocation) return;
//     //기존에 존재하는 내 스터디 장소

//     if (isFirstPage) {
//       const convertMergeParticipations = convertStudyToParticipations(
//         studyVoteData,
//         location,
//         false,
//       );
//       setMergeParticipations(convertMergeParticipations);
//       const findMyStudy = convertMergeParticipations.find(
//         (par) => par.place._id === myStudyParticipation?.place._id,
//       );
//       //기준 투표 장소 또는 즐겨찾기 메인 장소로 자동 선택
//       setMyVote({
//         main: findMyStudy?.place._id || findMyPreferMainPlace?.place._id || null,
//         sub: [],
//       });
//     } else {
//       //즐겨찾기 메인 장소를 투표한 경우

//       if (myVote?.main === findMyPreferMainPlace?.place._id) {
//         const findMyPreferSubPlaceArr = studyVoteData?.participations
//           .filter((par) => preference?.subPlace.includes(par.place._id))
//           .map((par) => par.place._id);

//         if (findMyPreferSubPlaceArr?.length >= DEFAULT_SUB_PLACE_CNT) {
//           setMyVote((old) => ({ ...old, sub: findMyPreferSubPlaceArr }));
//         } else {
//           const temp = [];
//           const sortedSub = sortByDistanceSub(studyVoteData, findMyPickMainPlace);
//           sortedSub.forEach((par, idx) => {
//             if (
//               idx < DEFAULT_SUB_PLACE_CNT - findMyPreferSubPlaceArr?.length &&
//               par.place.distance <= RECOMMENDATION_KM
//             )
//               temp.push(par.place._id);
//           });
//           setMyVote((old) => ({ ...old, sub: [...findMyPreferSubPlaceArr, ...temp] }));
//         }
//       } else {
//         const temp = [];
//         const sortedSub = sortByDistanceSub(studyVoteData, findMyPickMainPlace);
//         sortedSub.forEach((par, idx) => {
//           if (idx < DEFAULT_SUB_PLACE_CNT && par.place.distance <= RECOMMENDATION_KM)
//             temp.push(par.place._id);
//         });
//         setMyVote((old) => ({ ...old, sub: temp }));
//       }
//     }
//   }, [preference, studyVoteData, isFirstPage, currentLocation, myStudyParticipation]);

//   useEffect(() => {
//     if (!mergeParticipations || !location) return;

//     if (!mergeParticipations.length) {
//       toast("info", "준비중인 지역으로, 직접 입력으로만 신청이 가능합니다.");
//       setIsRightDrawer(true);
//       return;
//     }

//     const newImageCache = new Map(imageCache);

//     mergeParticipations.forEach((par) => {
//       const placeId = par.place._id;
//       if (!newImageCache.has(placeId)) {
//         const randomImage = STUDY_MAIN_IMAGES[getRandomIdx(STUDY_MAIN_IMAGES.length)];
//         newImageCache.set(placeId, (par.place as StudyPlaceProps)?.image || randomImage);
//       }
//     });
//     setImageCache(newImageCache);

//     const getThumbnailCardInfoArr = setStudyThumbnailCard(
//       mergeParticipations,
//       preference,
//       isFirstPage
//         ? currentLocation
//         : { lat: findMyPickMainPlace?.place.latitude, lon: findMyPickMainPlace?.place?.longitude },
//       null,
//       true,
//       location,
//       isFirstPage ? null : myVote,
//       newImageCache,
//     );

//     setThumbnailCardinfoArr(getThumbnailCardInfoArr);
//   }, [mergeParticipations, isFirstPage, currentLocation, myVote, location]);

//   useEffect(() => {
//     if (!myVote?.main) setIsFirstPage(true);
//     else {
//       if (date !== dayjsToStr(dayjs())) {
//         const temp = [];
//         const sortedSub = sortByDistanceSub(studyVoteData, findMyPickMainPlace);
//         sortedSub.forEach((par) => {
//           if (par.place.distance <= RECOMMENDATION_KM) temp.push(par.place._id);
//         });
//         setMyVote((old) => ({ ...old, sub: temp }));
//       }
//       setCenterLocation({
//         lat: findMyPickMainPlace?.place?.latitude,
//         lon: findMyPickMainPlace?.place?.longitude,
//       });
//     }
//   }, [myVote?.main]);

//   const handleClickPlaceButton = (id: string) => {
//     if (isFirstPage) {
//       if (myVote?.main === id) return;
//       else setMyVote({ main: id, sub: [] });
//     } else {
//       if (!myVote?.main) {
//         setMyVote({ main: id, sub: [] });
//       } else if (myVote?.main === id) {
//         setMyVote({ main: null, sub: [] });
//       } else if (myVote?.sub.includes(id))
//         setMyVote((old) => ({ ...old, sub: old.sub.filter((place) => place !== id) }));
//       else {
//         setMyVote((old) => ({ ...old, sub: [...old.sub, id] }));
//       }
//     }
//   };

//   const resetStudy = useResetStudyQuery();

//   const onClickStudyVote = () => {
//     if (myStudyParticipation) {
//       setVoteTime(voteTime);
//       setAlertModalInfo({
//         title: "스터디 장소 변경",
//         subTitle: "장소를 변경하는 경우 기존에 투표 장소는 취소됩니다.",
//         text: "변경합니다",
//         func: () => {
//           handleVote();
//         },
//         subFunc: () => {
//           setIsTimeDrawer(false);
//           setAlertModalInfo(null);
//         },
//       });
//       return;
//     }
//     handleVote();
//   };

//   const handleVote = () => {
//     if (!myVote?.main || !voteTime?.start || !voteTime?.end) {
//       typeToast("omission");
//       return;
//     }
//     patchAttend({ place: myVote.main, subPlace: myVote?.sub, ...voteTime });
//   };
//   const handleSuccess = () => {
//     setIsModal(false);
//     typeToast("vote");
//     resetStudy();
//     newSearchParams.set("center", "votePlace");
//     router.replace(`/studyPage?${newSearchParams.toString()}`);
//     setIsVoteDrawer(false);
//   };

//   const drawerOptions: BottomFlexDrawerOptions = {
//     header: {
//       title: "스터디 참여 시간 선택",
//       subTitle: "예상 시작 시간과 종료 시간을 선택해 주세요!",
//     },
//     footer: {
//       text: "신청 완료",
//       func: onClickStudyVote,
//       loading: isLoading,
//     },
//   };

//   const onClickPlaceSelectButton = () => {
//     if (dayjsToStr(dayjs()) === date) {
//       setIsRightDrawer(true);
//     } else {
//       toast("warning", "실시간 스터디는 당일에만 신청 가능합니다");
//     }
//   };

//   return (
//     <>
//       <BottomFlexDrawer
//         drawerOptions={{
//           footer: {
//             text: isTodayVote || !isFirstPage ? "선택 완료" : "다음",
//             func:
//               isFirstPage && !isTodayVote
//                 ? () => setIsFirstPage(false)
//                 : () => setIsTimeDrawer(true),
//           },
//         }}
//         isOverlay={false}
//         isDrawerUp
//         isHideBottom
//         setIsModal={setIsModal}
//         zIndex={800}
//         height={468 + iPhoneNotchSize()}
//       >
//         <Flex direction="column" w="100%">
//           <Flex mb={4} justify="space-between">
//             <Box>
//               <Box mb={1} lineHeight="28px" fontWeight="bold" fontSize="18px">
//                 {isFirstPage
//                   ? dayjsToFormat(dayjs(date).locale("ko"), "M월 D일(ddd) 스터디 투표")
//                   : "2지망 투표"}{" "}
//               </Box>
//               <Box color="gray.500" fontSize="12px" lineHeight="16px">
//                 {isFirstPage && "원하시는 카페가 없으신가요?"}
//                 {!isFirstPage && (
//                   <Box as="span">
//                     원하시는 2지망 카페를 선택해 주세요{" "}
//                     <b style={{ color: "var(--color-blue)" }}>(다중 선택)</b>
//                   </Box>
//                 )}
//               </Box>
//             </Box>
//             {isFirstPage && (
//               <Button
//                 mt="auto"
//                 as="div"
//                 fontSize="13px"
//                 fontWeight={500}
//                 size="xs"
//                 variant="ghost"
//                 height="20px"
//                 color="var(--color-blue)"
//                 onClick={() => onClickPlaceSelectButton()}
//               >
//                 직접 입력
//               </Button>
//             )}
//           </Flex>
//           <Box
//             overflow="scroll"
//             h="312px"
//             sx={{
//               "&::-webkit-scrollbar": {
//                 display: "none",
//               },
//             }}
//           >
//             {thumbnailCardInfoArr?.map((props, idx) => {
//               const id = props.id;

//               return (
//                 <Box key={idx} mb={3}>
//                   <PickerRowButton
//                     {...props}
//                     participantCnt={props.participants.length}
//                     onClick={() => handleClickPlaceButton(id)}
//                     pickType={
//                       !isFirstPage && myVote?.sub.includes(id)
//                         ? "second"
//                         : myVote?.main !== id
//                         ? null
//                         : isFirstPage
//                         ? "first"
//                         : "main"
//                     }
//                   />
//                 </Box>
//               );
//             })}
//           </Box>
//         </Flex>
//       </BottomFlexDrawer>
//       {isRightDrawer && (
//         <VoteDrawerPlaceDrawer
//           setIsVoteDrawer={setIsVoteDrawer}
//           date={date}
//           setIsRightDrawer={setIsRightDrawer}
//         />
//       )}
//       {isTimeDrawer && (
//         <StudyVoteTimeRulletDrawer
//           setVoteTime={setVoteTime}
//           drawerOptions={drawerOptions}
//           setIsModal={setIsModal}
//           zIndex={800}
//         />
//       )}
//       {alertModalInfo && (
//         <AlertModal
//           options={alertModalInfo}
//           colorType="red"
//           setIsModal={() => setAlertModalInfo(null)}
//         />
//       )}
//     </>
//   );
// }

// interface SubPlaceInfo extends StudyPlaceProps {
//   distance: number;
// }
// export interface SubPlaceProps extends StudyParticipationProps {
//   place: SubPlaceInfo;
// }

// export const sortByDistanceSub = (
//   studyVoteData: StudyVoteDataProps,
//   mainPlace: StudyParticipationProps,
// ): SubPlaceProps[] => {
//   const updatedParticipations = studyVoteData.participations.map((participation) => {
//     const distance = getDistanceFromLatLonInKm(
//       participation.place.latitude,
//       participation.place.longitude,
//       mainPlace.place.latitude,
//       mainPlace.place.longitude,
//     );
//     return {
//       ...participation,
//       place: {
//         ...participation.place,
//         distance, // distance 추가
//       },
//     };
//   });

//   const sortedArr = updatedParticipations.sort((a, b) => {
//     if (a.place.distance < b.place.distance) return -1;
//     if (a.place.distance > b.place.distance) return 1;
//     return 0;
//   });

//   return sortedArr.filter((par) => par.place._id !== mainPlace.place._id);
// };

// export default VoteDrawer;
