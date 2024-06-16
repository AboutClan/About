import { Box } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  IPostThumbnailCard,
  PostThumbnailCard,
} from "../../components/molecules/cards/PostThumbnailCard";
import { useGatherQuery } from "../../hooks/gather/queries";
import { LocationEn } from "../../types/services/locationTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { setGatherDataToCardCol } from "../home/HomeGatherCol";

export default function GatherMain() {
  const searchParams = useSearchParams();

  const location = convertLocationLangTo(searchParams.get("location") as LocationEn, "kr");
  const [cardDataArr, setCardDataArr] = useState<IPostThumbnailCard[]>();

  const { data: gathers } = useGatherQuery();

  useEffect(() => {
    if (!gathers) return;
    setCardDataArr(
      setGatherDataToCardCol(
        location
          ? gathers.filter((gather) => gather.place === "전체" || gather.place.includes(location))
          : gathers,
      ),
    );
  }, [gathers, location]);

  return (
    <Box m="0 16px">
      {cardDataArr && (
        <>
          {cardDataArr.map((cardData, idx) => (
            <Box mb="12px" key={idx}>
              <PostThumbnailCard postThumbnailCardProps={cardData} />
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}

// interface IGatherMain {
//   category: LocationFilterType;
// }

// function GatherMain({ category }: IGatherMain) {
//   const errorToast = useErrorToast();

//   const setIsGatherLoading = useSetRecoilState(isGatherLoadingState);

//   const [gatherData, setGatherData] = useState<IGather[]>();

//   const { data: gatherAll, isLoading } = useGatherQuery({
//     onError: errorToast,
//   });

//   useEffect(() => {
//     if (isLoading) return;
//     const lastGather = gatherAll.slice(-1)[0];
//     localStorage.setItem(GATHER_ALERT, String(lastGather.id));
//     let filtered = gatherAll;
//     if (category !== "전체")
//       filtered = gatherAll.filter((item) => {
//         const [main, sub] = item.place.split("/");
//         return main === category || sub === category || main === "전체";
//       });
//     setGatherData(filtered);
//     setIsGatherLoading(false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [category, gatherAll, isLoading]);

//   const gathers = gatherData && [...gatherData];

//   return (
//     <Layout>
//       {gathers ? (
//         <>
//           {gathers.map((gather, idx) => (
//             <AboutGatherBlock
//               key={idx}
//               gather={gather}
//               isImagePriority={idx < 4}
//             />
//           ))}
//         </>
//       ) : (
//         <>
//           {new Array(6).fill(0).map((_, idx) => (
//             <GatherBlockSkeleton key={idx} />
//           ))}
//         </>
//       )}
//     </Layout>
//   );
// }

// const Layout = styled.div`
//   padding: var(--gap-4);
// `;

// export default GatherMain;
