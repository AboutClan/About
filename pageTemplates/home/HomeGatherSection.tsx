import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { IPostThumbnailCard } from "../../components/molecules/cards/PostThumbnailCard";
import {
  CardColumnLayout,
  CardColumnLayoutSkeleton,
} from "../../components/organisms/CardColumnLayout";
import { useGatherQuery } from "../../hooks/gather/queries";
import { prevPageUrlState, slideDirectionState } from "../../recoils/navigationRecoils";
import { ITextAndColorSchemes } from "../../types/components/propTypes";
import { GatherStatus, IGather } from "../../types/models/gatherTypes/gatherTypes";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import { getRandomImage } from "../../utils/imageUtils";

export default function HomeGatherSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get("location");

  const [cardDataArr, setCardDataArr] = useState<IPostThumbnailCard[]>([]);

  const setSlideDirection = useSetRecoilState(slideDirectionState);
  const setPrevPageUrl = useSetRecoilState(prevPageUrlState);

  const { data: gathers } = useGatherQuery();

  useEffect(() => {
    if (!gathers) return;

    const handleNavigate = () => {
      setSlideDirection("right");
      setPrevPageUrl("/home");
    };

    setCardDataArr(setGatherDataToCardCol(gathers, handleNavigate).slice(0, 3));
  }, [gathers]);

  return (
    <Box mb="24px">
      <Flex align="center" h="58px" fontWeight={600} fontSize="20px">
        🔥 ABOUT 모임
      </Flex>
      <>
        {cardDataArr.length ? (
          <CardColumnLayout
            cardDataArr={cardDataArr}
            url={`/gather?location=${location}`}
            func={() => setSlideDirection("right")}
          />
        ) : (
          <CardColumnLayoutSkeleton />
        )}
      </>
    </Box>
  );
}

export const setGatherDataToCardCol = (
  gathers: IGather[],
  func?: () => void,
): IPostThumbnailCard[] => {
  const cardCol: IPostThumbnailCard[] = gathers.map((gather, idx) => ({
    title: gather.title,
    subtitle:
      gather.place + " · " + gather.type.title + " · " + dayjs(gather.date).format("M월 D일(ddd)"),
    participants: [gather.user, ...gather.participants.map((par) => par.user)] as IUserSummary[],
    url: `/gather/${gather.id}`,
    func,
    image: {
      url: gather.image || getRandomImage(),
      priority: idx < 4,
    },
    badge: getGatherBadge(gather.status),
    maxCnt: gather.memberCnt.max,
  }));

  return cardCol;
};

const getGatherBadge = (gatherStatus: GatherStatus): ITextAndColorSchemes => {
  switch (gatherStatus) {
    case "open":
      return { text: "오픈", color: "var(--color-mint)" };
    case "close":
      return { text: "취소", color: "var(--gray-500)" };
    case "pending":
      return { text: "모집중", color: "var(--color-red)" };
    case "end":
      return { text: "open", color: "mint" };
  }
};

const Layout = styled.div`
  padding: 16px;
`;
