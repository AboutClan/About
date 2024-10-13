import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import ShadowBlockButton from "../../components/atoms/buttons/ShadowBlockButton";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import { CardColumnLayoutSkeleton } from "../../components/organisms/CardColumnLayout";
import { useGatherQuery } from "../../hooks/gather/queries";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
dayjs().locale("ko");

export default function HomeGatherCol() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const tab = searchParams.get("tab") as "recommendation" | "gather";
  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>([]);

  const setSlideDirection = useSetRecoilState(slideDirectionState);
  const setTransferGather = useSetRecoilState(transferGatherDataState);

  const { data: gathers } = useGatherQuery(-1);

  useEffect(() => {
    if (!gathers) return;
    const handleNavigate = (gather: IGather) => {
      setTransferGather(gather);
    };
    setCardDataArr(setGatherDataToCardCol(gathers, tab, handleNavigate).slice(0, 3));
  }, [gathers]);
  console.log(25, cardDataArr);
  return (
    <Box my={4}>
      {cardDataArr?.length ? (
        <Flex direction="column">
          {cardDataArr.map((cardData, idx) => (
            <GatherThumbnailCard key={idx} {...cardData} />
          ))}
          {cardDataArr.length >= 3 && (
            <ShadowBlockButton
              text="더보기"
              url={`/gather?location=${location}`}
              func={() => setSlideDirection("right")}
            />
          )}
        </Flex>
      ) : (
        <CardColumnLayoutSkeleton />
      )}
    </Box>
  );
}

export const setGatherDataToCardCol = (
  gathers: IGather[],
  tab: "recommendation" | "gather",
  func: (gather: IGather) => void,
): GatherThumbnailCardProps[] => {
  const cardCol: GatherThumbnailCardProps[] = gathers.map((gather, idx) => ({
    title: gather.title,
    status: gather.status,
    category: gather.type.title,
    date: dayjsToFormat(dayjs(gather.date).locale("ko"), "M.D(ddd) HH:mm"),
    place: gather.location.main,
    imageProps: {
      image: gather.image || getRandomImage(),
      priority: tab === "gather" && idx < 4,
    },
    id: gather.id,
    maxCnt: gather.memberCnt.max,
    participants: gather.participants,
    func: func ? () => func(gather) : undefined,
  }));

  return cardCol;
};
