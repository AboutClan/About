export default function Empty() {
  return null;
}
// import { Badge } from "@chakra-ui/react";
// import dayjs from "dayjs";
// import { useRouter } from "next/router";
// import { useRecoilValue, useSetRecoilState } from "recoil";
// import styled from "styled-components";

// import Avatar from "../../../components/atoms/Avatar";
// import Header from "../../../components/layouts/Header";
// import Slide from "../../../components/layouts/PageSlide";
// import { BADGE_COLOR_MAPPINGS } from "../../../constants/serviceConstants/badgeConstants";
// import { prevPageUrlState } from "../../../recoils/previousAtoms";
// import { transferMemberDataState } from "../../../recoils/transferRecoils";
// import { IUser } from "../../../types/models/userTypes/userInfoTypes";
// import { getUserBadge } from "../../../utils/convertUtils/convertDatas";
// import { dayjsToFormat } from "../../../utils/dateTimeUtils";

// function MemberDetail() {
//   const router = useRouter();

//   const memberData = useRecoilValue(transferMemberDataState);

//   const setBeforePage = useSetRecoilState(prevPageUrlState);

//   const section = memberData?.section;

//   const onClickUser = (user: IUser) => {
//     setBeforePage(router?.asPath);
//     router.push(`/profile/${user.uid}`);
//   };

//   return (
//     <>
//       <Header title={SECTION_NAME[section]} url={`/member/${router.query?.location}`} />

//       <Slide>
//         <Container>
//           {memberData?.members.map((who) => {
//             const badge = getUserBadge(who.score, who.uid);
//             const rest = section === "resting" && who?.rest;
//             return (
//               <Item key={who.uid} onClick={() => onClickUser(who)}>
//                 <ProfileWrapper>
//                   <Avatar
//                     userId={who._id}
//                     image={who.profileImage}
//                     avatar={who.avatar}
//                     uid={who.uid}
//                     size="sm"
//                   />
//                 </ProfileWrapper>
//                 <Info>
//                   <Name>
//                     <span>{who.name}</span>
//                     <Badge
//                       fontSize={10}
//                       colorScheme={BADGE_COLOR_MAPPINGS[badge]}
//                       ml="var(--gap-2)"
//                     >
//                       {badge}
//                     </Badge>
//                   </Name>
//                   <div>
//                     {section === "member" || section?.includes("group") ? (
//                       who.comment
//                     ) : section === "human" ? (
//                       `가입일: ${dayjs(who.registerDate).format("YYYY년 M월 D일")}`
//                     ) : (
//                       <>
//                         <RestInfo>
//                           <span>{rest.type}휴식</span>/
//                           {rest.type === "일반" ? (
//                             <>
//                               <span>
//                                 {dayjsToFormat(dayjs(rest.startDate), "YY-MM-DD")} ~{" "}
//                                 {dayjsToFormat(dayjs(rest.endDate), "YY-MM-DD")}
//                               </span>
//                               <DDay>
//                                 D-
//                                 {dayjs(rest.endDate).diff(dayjs(), "day")}{" "}
//                               </DDay>
//                             </>
//                           ) : (
//                             <span>자율참여 멤버</span>
//                           )}
//                         </RestInfo>
//                         <span>{rest?.content}</span>
//                       </>
//                     )}
//                   </div>
//                 </Info>
//               </Item>
//             );
//           })}
//         </Container>
//       </Slide>
//     </>
//   );
// }

// const Container = styled.div`
//   margin: 0 var(--gap-4);
// `;

// const Item = styled.div`
//   display: flex;
//   padding: var(--gap-3) 0;
//   border-top: var(--border);
//   border-bottom: var(--border);
// `;

// const ProfileWrapper = styled.div``;

// const Info = styled.div`
//   margin-left: var(--gap-3);
//   display: flex;
//   flex-direction: column;

//   justify-content: space-between;
//   > div:last-child {
//     font-size: 12px;
//     color: var(--gray-600);
//     display: flex;
//     flex-direction: column;
//   }
// `;

// const RestInfo = styled.div`
//   > span:first-child {
//     margin-right: var(--gap-1);
//   }
//   > span:nth-child(2) {
//     margin-left: var(--gap-1);
//   }
// `;

// const DDay = styled.span`
//   color: var(--color-red);
//   margin-left: var(--gap-2);
// `;

// const Name = styled.div`
//   display: flex;
//   align-items: center;
//   font-weight: 600;
//   font-size: 13px;
// `;

// export default MemberDetail;
