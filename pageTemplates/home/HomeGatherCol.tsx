import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import {
  GatherThumbnailCard,
  GatherThumbnailCardProps,
} from "../../components/molecules/cards/GatherThumbnailCard";
import { GatherThumbnailCardSkeleton } from "../../components/skeleton/GatherThumbnailCardSkeleton";
import { useGatherQuery } from "../../hooks/gather/queries";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { IGather } from "../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
dayjs().locale("ko");

export default function HomeGatherCol() {
  const { data: session } = useSession();

  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>([]);

  const setTransferGather = useSetRecoilState(transferGatherDataState);

  const { data: gathers } = useGatherQuery(-1);

  useEffect(() => {
    if (!gathers) return;
    const handleNavigate = (gather: IGather) => {
      setTransferGather(gather);
    };
    setCardDataArr(setGatherDataToCardCol(gathers.slice(0, 3), false, handleNavigate));
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
      <SectionFooterButton
        url={`/gather?location=${convertLocationLangTo(session?.user.location, "en")}`}
      />
    </Box>
  );
}

export const setGatherDataToCardCol = (
  gathers: IGather[],
  imagePriority: boolean,
  func?: (gather: IGather) => void,
): GatherThumbnailCardProps[] => {
  const cardCol: GatherThumbnailCardProps[] = gathers.map((gather, idx) => ({
    title: gather.title,
    status: gather.status,
    category: gather.type.title,
    date: dayjsToFormat(dayjs(gather.date).locale("ko"), "M.D(ddd) HH:mm"),
    place: gather.location.main,
    imageProps: {
      image: gather.image || getRandomImage(),
      priority: imagePriority && idx < 4,
    },
    id: gather.id,
    maxCnt: gather.memberCnt.max,
    participants: [{ user: gather.user as IUserSummary, phase: "first" }, ...gather.participants],
    func: func ? () => func(gather) : undefined,
  }));

  return cardCol;
};
