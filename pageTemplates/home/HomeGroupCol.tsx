import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import { GroupThumbnailCard } from "../../components/molecules/cards/GroupThumbnailCard";
import { createGroupThumbnailProps } from "../../pages/group";
import { transferGroupDataState } from "../../recoils/transferRecoils";
import { IGroup } from "../../types/models/groupTypes/group";
import { convertLocationLangTo } from "../../utils/convertUtils/convertDatas";
import GroupSkeletonMain from "../group/GroupSkeletonMain";
dayjs().locale("ko");

interface HomeGroupColProps {
  threeGroups: IGroup[];
  isStudy?: boolean;
}

export default function HomeGroupCol({ threeGroups, isStudy }: HomeGroupColProps) {
  const { data: session } = useSession();

  const setTransferGroup = useSetRecoilState(transferGroupDataState);

  return (
    <Box my={4}>
      {threeGroups?.length ? (
        <Flex direction="column">
          {threeGroups
            .slice()
            .reverse()
            .map((group, idx) => {
              const status =
                group.status === "end"
                  ? "end"
                  : group.status === "planned"
                  ? "planned"
                  : group.memberCnt.max === 0
                  ? "pending"
                  : group.memberCnt.max <= group.participants.length
                  ? "full"
                  : group.memberCnt.max - 2 <= group.participants.length
                  ? "imminent"
                  : group.memberCnt.min > group.participants.length
                  ? "planned"
                  : group.status;

              return (
                <GroupThumbnailCard
                  key={idx}
                  isBig={false}
                  {...createGroupThumbnailProps(
                    group,
                    status,
                    idx,
                    () => setTransferGroup(group),
                    group.category.main === "콘텐츠",
                  )}
                />
              );
            })}
          {threeGroups.length >= 3 && (
            <SectionFooterButton
              url={`/group?location=${convertLocationLangTo(session?.user.location, "en")}`}
            />
          )}
        </Flex>
      ) : (
        [1, 2, 3].map((idx) => <GroupSkeletonMain key={idx} isStudy={isStudy} />)
      )}
    </Box>
  );
}
