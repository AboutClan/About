import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { GATHER_MAIN_IMAGE_ARR } from "../../assets/gather";
import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import { GatherThumbnailCardSkeleton } from "../../components/skeleton/GatherThumbnailCardSkeleton";
import { backUrlState } from "../../recoils/navigationRecoils";
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
  const setBackUrl = useSetRecoilState(backUrlState);

  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>([]);

  useEffect(() => {
    if (!gathers) return;
    setCardDataArr(
      setGatherDataToCardCol(gathers.slice(0, 3), isPriority, () => setBackUrl("/home")),
    );
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
  func?: () => void,
): GatherThumbnailCardProps[] => {
  const cardCol: GatherThumbnailCardProps[] = gathers.map((gather, idx) => {
    if (!imageCache[gather.id]) {
      imageCache[gather.id] = gather.image || getRandomImage(GATHER_MAIN_IMAGE_ARR["공통"]);
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

      age: gather.age,
      func,
    };
  });

  return cardCol;
};
