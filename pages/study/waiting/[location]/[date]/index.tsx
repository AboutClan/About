function Index() {
  return <></>;
}

export default Index;

// import { Box, Flex } from "@chakra-ui/react";
// import dayjs from "dayjs";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { useSetRecoilState } from "recoil";
// import styled from "styled-components";

// import HighlightedTextButton from "../../../../../components/atoms/buttons/HighlightedTextButton";
// import Divider from "../../../../../components/atoms/Divider";
// import Slide from "../../../../../components/layouts/PageSlide";
// import TabNav, { ITabNavOptions } from "../../../../../components/molecules/navs/TabNav";
// import { useStudyVoteQuery } from "../../../../../hooks/study/queries";
// import { getStudyDateStatus } from "../../../../../libs/study/date/getStudyDateStatus";
// import { getMyStudy } from "../../../../../libs/study/getMyStudy";
// import { sortStudyVoteData } from "../../../../../libs/study/sortStudyVoteData";
// import StudyPointGuideModal from "../../../../../modals/study/StudyPointGuideModal";
// import StudyCover from "../../../../../pageTemplates/study/StudyCover";
// import StudyDateBar from "../../../../../pageTemplates/study/StudyDateBar";
// import StudyHeader from "../../../../../pageTemplates/study/StudyHeader";
// import StudyWaitingOverview from "../../../../../pageTemplates/study/StudyWaitingOverview";
// import StudyWaitingPlaces from "../../../../../pageTemplates/study/StudyWaitingPlaces";
// import StudyWaitingUsers from "../../../../../pageTemplates/study/StudyWaitingUsers";
// import { myStudyInfoState, studyDateStatusState } from "../../../../../recoils/studyRecoils";
// import { StudyParticipationProps } from "../../../../../types/models/studyTypes/studyDetails";
// import { StudyWaitingUser } from "../../../../../types/models/studyTypes/studyInterActions";
// import { ActiveLocation } from "../../../../../types/services/locationTypes";
// import { convertLocationLangTo } from "../../../../../utils/convertUtils/convertDatas";

// export default function Page() {
//   const { data: session } = useSession();
//   const { location, date } = useParams<{ location: string; date: string }>() || {};

//   const setMyStudy = useSetRecoilState(myStudyInfoState);

//   const { data: studyData } = useStudyVoteQuery(
//     date,
//     convertLocationLangTo(location as ActiveLocation, "kr"),
//     false,
//     false,
//     {
//       enabled: !!location || !!date,
//     },
//   );

//   const studyAll = studyData?.[0]?.participations;

//   const [isHidden, setIsHidden] = useState(true);

//   const setStudyDateStatus = useSetRecoilState(studyDateStatusState);

//   useEffect(() => {
//     setStudyDateStatus(getStudyDateStatus(date));
//   }, [date]);

//   useEffect(() => {
//     if (!studyAll || !session?.user) return;
//     setMyStudy(getMyStudy(studyAll, session.user.uid));
//   }, [studyAll]);

//   const studyWaitingUsers = studyAll && getWaitingSpaceProps(studyAll);
//   const sortedStudyPlaces = studyAll && sortStudyVoteData(studyAll, null, false);

//   const [category, setCategory] = useState("참여 멤버");
//   const [isPointModal, setIsPointModal] = useState(false);

//   const categoryArr = ["참여 멤버", "스터디"];

//   const tabArr: ITabNavOptions[] = categoryArr.map((category) => ({
//     text: category,
//     func: () => setCategory(category),
//     flex: 1,
//   }));

//   return (
//     <>
//       <Layout>
//         {studyWaitingUsers && (
//           <>
//             <StudyHeader
//               brand="스터디 참여 현황"
//               fullname="스터디 참여 현황"
//               locationDetail="세부"
//               coverImage="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%B9%B4%ED%8E%98+%EB%B0%B0%EA%B2%BD/%EB%9E%9C%EB%8D%A4/%EA%B7%B8%EB%A6%BC11.png"
//             />
//             <Slide>
//               <StudyCover
//                 imageUrl="https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%B9%B4%ED%8E%98+%EB%B0%B0%EA%B2%BD/%EB%9E%9C%EB%8D%A4/%EA%B7%B8%EB%A6%BC11.png"
//                 brand=""
//                 isPrivateStudy={true}
//               />

//               <StudyWaitingOverview setIsModal={setIsPointModal} />

//               <Divider />

//               <StudyDateBar
//                 isPrivateStudy={false}
//                 place={{
//                   locationDetail: "",
//                   fullname: "",
//                   image:
//                     "https://studyabout.s3.ap-northeast-2.amazonaws.com/%EC%B9%B4%ED%8E%98+%EB%A1%9C%EA%B3%A0/%EA%B0%9C%EC%9D%B8%EC%8A%A4%ED%84%B0%EB%94%94.webp",
//                 }}
//               />
//               <TabNav tabOptionsArr={tabArr} selected={category} />
//               <Box h="4px" />
//               {category === "참여 멤버" ? (
//                 <StudyWaitingUsers
//                   studyWaitingUsers={studyWaitingUsers.filter(
//                     (who) =>
//                       who.place.branch !== "개인 스터디" ||
//                       (who.place.branch === "개인 스터디" &&
//                         who.user.location ===
//                           convertLocationLangTo(location as ActiveLocation, "kr")),
//                   )}
//                 />
//               ) : (
//                 <StudyWaitingPlaces
//                   studyWaitingPlaces={isHidden ? sortedStudyPlaces.slice(0, 8) : sortedStudyPlaces}
//                 />
//               )}
//               {category === "스터디" && sortedStudyPlaces.length >= 8 && isHidden && (
//                 <Flex bgColor="white" justify="center" align="center" py="8px">
//                   <HighlightedTextButton text="더 보기" onClick={() => setIsHidden(false)} />
//                 </Flex>
//               )}
//             </Slide>
//           </>
//         )}
//       </Layout>
//       {isPointModal && <StudyPointGuideModal setIsModal={setIsPointModal} />}
//     </>
//   );
// }

// const getWaitingSpaceProps = (studyData: StudyParticipationProps[]) => {
//   const userArr: StudyWaitingUser[] = [];

//   studyData.forEach((par) => {
//     par.members.forEach((who) => {
//       const user = who.user;
//       const place = { id: par.place._id, branch: par.place.branch };
//       const findUser = userArr.find((obj) => obj.user.uid === user.uid);
//       if (!findUser) {
//         if (who.firstChoice) {
//           userArr.push({ user, place, subPlace: [], createdAt: who.createdAt });
//         } else userArr.push({ user, place: null, subPlace: [place], createdAt: who.createdAt });
//       } else {
//         if (who.firstChoice) {
//           findUser.place = place;
//         } else {
//           if (!findUser.subPlace.includes(place)) {
//             findUser.subPlace.push(place);
//           }
//         }
//       }
//     });
//   });

//   return userArr.sort((a, b) => (dayjs(a.createdAt).isAfter(dayjs(b.createdAt)) ? 1 : -1));
// };

// const Layout = styled.div`
//   padding-bottom: 161px;
// `;
