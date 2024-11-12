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
import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { transferGroupDataState } from "../../recoils/transferRecoils";
import { IGroup } from "../../types/models/groupTypes/group";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import { getRandomImage } from "../../utils/imageUtils";
dayjs().locale("ko");

interface HomeGroupColProps {
  threeGroups: IGroup[];
}

export default function HomeGroupCol({ threeGroups }: HomeGroupColProps) {
  const { data: session } = useSession();

  const [cardDataArr, setCardDataArr] = useState<GatherThumbnailCardProps[]>([]);

  const setTransferGroup = useSetRecoilState(transferGroupDataState);

  useEffect(() => {
    if (!threeGroups) return;
    const handleNavigate = (group: IGroup) => {
      setTransferGroup(group);
    };

    setCardDataArr(setGroupDataToCardCol(threeGroups, false, handleNavigate));
  }, [threeGroups]);

  return (
    <Box my={4}>
      {cardDataArr?.length ? (
        <Flex direction="column">
          {cardDataArr.map((cardData, idx) => (
            <GatherThumbnailCard key={idx} {...cardData} />
          ))}
          {cardDataArr.length >= 3 && (
            <SectionFooterButton
              url={`/group?location=${convertLocationLangTo(session?.user.location, "en")}`}
            />
          )}
        </Flex>
      ) : (
        [1, 2, 3].map((idx) => <GatherThumbnailCardSkeleton key={idx} />)
      )}
    </Box>
  );
}

export const setGroupDataToCardCol = (
  groups: IGroup[],
  imagePriority: boolean,
  func?: (group: IGroup) => void,
): GatherThumbnailCardProps[] => {
  const cardCol: GatherThumbnailCardProps[] = groups.map((group, idx) => ({
    type: "group",
    title: group.title,
    status: group.status,
    category: group.category.main,
    date: dayjsToFormat(dayjs(group.createdAt).locale("ko"), "YY년 M월 D일 개설"),
    place: group.category.sub,
    imageProps: {
      image: group?.squareImage || getRandomImage(),
      priority: imagePriority && idx < 4,
    },
    id: group.id,
    maxCnt: group.memberCnt.max,
    participants: !group.isSecret
      ? group.participants
      : group.participants.map(() => ({ user: ABOUT_USER_SUMMARY, role: "member" })),
    func: func ? () => func(group) : undefined,
  }));

  return cardCol;
};
