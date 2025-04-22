import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import { GatherThumbnailCardSkeleton } from "../../components/skeleton/GatherThumbnailCardSkeleton";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
dayjs().locale("ko");

interface HomeGatherColProps {
  gathers: IGather[];
  isPriority: boolean;
}

export default function HomeGatherCol({ gathers, isPriority }: HomeGatherColProps) {
  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>([]);

  const setTransferGather = useSetRecoilState(transferGatherDataState);

  useEffect(() => {
    if (!gathers) return;
    const handleNavigate = (gather: IGather) => {
      setTransferGather(gather);
    };
    setCardDataArr(setGatherDataToCardCol(gathers.slice(0, 3), isPriority, handleNavigate));
  }, [gathers]);

  return (
    <Box my={4}>
      {cardDataArr?.length ? (
        <Flex direction="column">
          {cardDataArr.map((cardData, idx) => (
            <GatherThumbnailCard key={idx} {...cardData} />
          ))}
        </Flex>
      ) : (
        <Flex direction="column">
          {[1, 2, 3].map((idx) => (
            <GatherThumbnailCardSkeleton key={idx} />
          ))}
        </Flex>
      )}{" "}
      <SectionFooterButton url="/gather" />
    </Box>
  );
}
const imageCache: { [key: string]: string } = {}; // 이미지 캐시 전역 변수

export const setGatherDataToCardCol = (
  gathers: IGather[],
  isPriority: boolean,
  func?: (gather: IGather) => void,
): GatherThumbnailCardProps[] => {
  const cardCol: GatherThumbnailCardProps[] = gathers.map((gather, idx) => {
    console.log(24, gather);
    if (!imageCache[gather.id]) {
      imageCache[gather.id] = gather.image || getRandomImage();
    }
    return {
      title: gather.title,
      status: gather.status,
      category: gather.type.title,
      date: dayjsToFormat(dayjs(gather.date).locale("ko"), "M.D(ddd) HH:mm"),
      place: gather.location.main,
      imageProps: {
        image: imageCache[gather.id], // 이미지를 캐싱하여 변경되지 않도록 함
        isPriority: isPriority && idx < 6,
      },
      id: gather.id,
      maxCnt: gather.memberCnt.max,
      participants: [{ user: gather.user as IUserSummary, phase: "first" }, ...gather.participants],
      func: func ? () => func(gather) : undefined,
    };
  });

  return cardCol;
};
