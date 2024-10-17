function HomeNewStudySpace() {
  return <></>;
}

export default HomeNewStudySpace;

// import { Box } from "@chakra-ui/react";
// import { useSearchParams } from "next/navigation";

// import SectionBar from "../../../components/molecules/bars/SectionBar";
// import { IPostThumbnailCard } from "../../../components/molecules/cards/PostThumbnailCard";
// import { CardColumnLayout } from "../../../components/organisms/CardColumnLayout";
// import { StudyPlaceProps } from "../../../types/models/studyTypes/studyDetails";

// interface HomeNewStudySpaceProps {
//   places: StudyPlaceProps[];
// }

// function HomeNewStudySpace({ places }: HomeNewStudySpaceProps) {
//   const searchParams = useSearchParams();

//   const date = searchParams.get("date");

//   const studyCardCol: IPostThumbnailCard[] = places?.map((place) => ({
//     title: place.branch,
//     subtitle: place.brand,
//     url: `/study/${place._id}/${date}`,
//     image: {
//       url: place.image,
//     },
//     badge: { text: "신규 오픈", colorScheme: "red" },
//     type: "study",
//     registerDate: place.registerDate,
//     id: place._id,
//   }));

//   return (
//     <>
//       <SectionBar title="신규 추가 스터디 장소" />
//       <Box m="16px">
//         {studyCardCol?.length ? (
//           <CardColumnLayout
//             cardDataArr={studyCardCol}
//             url={`/studyList/?${searchParams.toString()}`}
//           />
//         ) : (
//           <Box>없음</Box>
//         )}
//       </Box>
//     </>
//   );
// }

// export default HomeNewStudySpace;
