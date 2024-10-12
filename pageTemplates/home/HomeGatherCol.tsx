import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import ShadowBlockButton from "../../components/atoms/buttons/ShadowBlockButton";
import { GatherThumbnailCard } from "../../components/molecules/cards/GatherThumbnailCard";
import { IPostThumbnailCard } from "../../components/molecules/cards/PostThumbnailCard";
import { CardColumnLayoutSkeleton } from "../../components/organisms/CardColumnLayout";
import { useGatherQuery } from "../../hooks/gather/queries";
import { slideDirectionState } from "../../recoils/navigationRecoils";
import { transferGatherDataState } from "../../recoils/transferRecoils";
import { ITextAndColorSchemes } from "../../types/components/propTypes";
import { GatherStatus, IGather } from "../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import { getRandomImage } from "../../utils/imageUtils";

export default function HomeGatherCol() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const tab = searchParams.get("tab") as "recommendation" | "gather";
  const [cardDataArr, setCardDataArr] = useState<IPostThumbnailCard[]>([]);

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

  return (
    <Box my="24px">
      {cardDataArr ? (
        <Flex direction="column">
          {cardDataArr.map((cardData, idx) => (
            <GatherThumbnailCard key={idx} postThumbnailCardProps={cardData} />
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
): IPostThumbnailCard[] => {
  const cardCol: IPostThumbnailCard[] = gathers.map((gather, idx) => ({
    title: gather.title,
    subtitle:
      gather.location.main +
      " · " +
      gather.type.title +
      " · " +
      dayjs(gather.date).format("M월 D일(ddd)"),
    participants: [gather.user, ...gather.participants.map((par) => par.user)] as IUserSummary[],
    url: `/gather/${gather.id}`,
    func: func ? () => func(gather) : undefined,
    image: {
      url: gather.image || getRandomImage(),
      priority: tab === "gather" && idx < 4,
    },
    badge: getGatherBadge(gather.status),
    maxCnt: gather.memberCnt.max,
    type: "gather",
  }));

  return cardCol;
};

const getGatherBadge = (gatherStatus: GatherStatus): ITextAndColorSchemes => {
  switch (gatherStatus) {
    case "open":
      return { text: "모집 마감", colorScheme: "grayTheme" };
    case "close":
      return { text: "취소", colorScheme: "grayTheme" };
    case "pending":
      return { text: "모집중", colorScheme: "mintTheme" };
    case "end":
      return { text: "종료", colorScheme: "grayTheme" };
  }
};
