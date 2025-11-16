function Certification() {
  return <></>;
}

export default Certification;

// import { Box, Button } from "@chakra-ui/react";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useRecoilState } from "recoil";

// import PageIntro from "../../../components/atoms/PageIntro";
// import SectionTitle from "../../../components/atoms/SectionTitle";
// import BottomNav from "../../../components/layouts/BottomNav";
// import Header from "../../../components/layouts/Header";
// import Slide from "../../../components/layouts/PageSlide";
// import ImageUploadInput from "../../../components/molecules/ImageUploadInput";
// import LocationSearch from "../../../components/organisms/location/LocationSearch";
// import { useToast } from "../../../hooks/custom/CustomToast";
// import { useKeypadHeight } from "../../../hooks/custom/useKeypadHeight";
// import { useStudySetQuery } from "../../../hooks/study/queries";
// import { useUserInfoQuery } from "../../../hooks/user/queries";
// import { transferStudyAttendanceState } from "../../../recoils/transferRecoils";
// import { LocationProps } from "../../../types/common";

// function Certification() {

//   const [isFocus, setIsFocus] = useState(false);

//   const keypadHeight = useKeypadHeight();

//   useEffect(() => {
//     if (isFocus && keypadHeight !== 0) {
//       window.scrollBy({ top: 130, behavior: "smooth" });
//     }
//   }, [isFocus, keypadHeight]);

//   return (
//     <>
//       <Box bgColor="white" mb={isFocus ? `${130}px` : 0} minH="calc(100dvh - var(--header-h))">
//         <Header title="" isBorder={false} />
//         <Slide>
//           <PageIntro
//             main={{ first: type === "soloRealTimes" ? "개인 스터디 인증" : "출석 인증하기" }}
//             sub="공부 사진을 인증해 주세요"
//           />
//           <ImageUploadInput setImageUrl={setImage} />
//           <Box mb={3}>
//             <SectionTitle text="현재 장소" isActive={isActive}>
//               <Button
//                 fontSize="12px"
//                 fontWeight={500}
//                 size="xs"
//                 variant="ghost"
//                 height="20px"
//                 color="var(--color-blue)"
//                 rightIcon={<i className="fa-solid fa-arrows-rotate" />}
//                 onClick={handleResetButton}
//               >
//                 초기화
//               </Button>
//             </SectionTitle>
//           </Box>
//           <LocationSearch
//             info={placeInfo}
//             setInfo={setPlaceInfo}
//             isActive={isActive}
//             hasInitialValue
//             setIsFocus={setIsFocus}
//           />
//         </Slide>
//       </Box>
//       <BottomNav url="/vote/attend/configuration" onClick={handleBottomNav} />
//     </>
//   );
// }

// export default Certification;
