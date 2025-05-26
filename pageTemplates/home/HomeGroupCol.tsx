import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSetRecoilState } from "recoil";

import SectionFooterButton from "../../components/atoms/SectionFooterButton";
import { GroupThumbnailCard } from "../../components/molecules/cards/GroupThumbnailCard";
import { createGroupThumbnailProps } from "../../pages/group";
import { backUrlState } from "../../recoils/navigationRecoils";
import { transferGroupDataState } from "../../recoils/transferRecoils";
import { IGroup } from "../../types/models/groupTypes/group";
import GroupSkeletonMain from "../group/GroupSkeletonMain";
dayjs().locale("ko");

interface HomeGroupColProps {
  threeGroups: IGroup[];
  isStudy?: boolean;
  type: "hobby" | "study1" | "study2" | "expected" | "self";
}

export default function HomeGroupCol({ threeGroups, isStudy, type }: HomeGroupColProps) {
  const setTransferGroup = useSetRecoilState(transferGroupDataState);
  const setBackUrlState = useSetRecoilState(backUrlState);

  const handleClick = (group: IGroup) => {
    setTransferGroup(group);
    setBackUrlState("/home");
  };

  const urlParam =
    type === "hobby"
      ? "category=1"
      : type === "study1"
      ? "category=3"
      : type === "study2"
      ? "category=2"
      : type === "self"
      ? "category=4"
      : "filter=expected";

  return (
    <Box my={4}>
      {threeGroups?.length ? (
        <Flex direction="column">
          {threeGroups
            .slice()
            .reverse()
            .map((group, idx) => {
              const status =
                group.id === 138
                  ? "end"
                  : group.status === "end"
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
                    () => handleClick(group),
                    false,
                  )}
                />
              );
            })}
          {threeGroups.length >= 3 && <SectionFooterButton url={`/group?${urlParam}`} />}
        </Flex>
      ) : (
        [1, 2, 3].map((idx) => <GroupSkeletonMain key={idx} isStudy={isStudy} />)
      )}
    </Box>
  );
}
