import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import { CardColumnLayoutSkeleton } from "../../components/organisms/CardColumnLayout";
import { useGatherQuery } from "../../hooks/gather/queries";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
dayjs().locale("ko");

export default function HomeGatherCol() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") as "recommendation" | "gather";

  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>([]);

  const setTransferGather = useSetRecoilState(transferGatherDataState);

  const { data: gathers } = useGatherQuery(-1);

  useEffect(() => {
    if (!gathers) return;
    const handleNavigate = (gather: IGather) => {
      setTransferGather(gather);
    };
    setCardDataArr(setGatherDataToCardCol(gathers, tab, handleNavigate).slice(0, 3));
  }, [gathers]);

  return (
    <Box my={4}>
      {cardDataArr?.length ? (
        <Flex direction="column">
          {cardDataArr.map((cardData, idx) => (
            <GatherThumbnailCard key={idx} {...cardData} />
          ))}
          {cardDataArr.length >= 3 && (
            <SectionFooterButton
              url={`/gather?location=${convertLocationLangTo(session?.user.location, "en")}`}
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
