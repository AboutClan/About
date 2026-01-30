import { Box, Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import { useGroupIdQuery, useGroupsMemberActivityQuery } from "../../../hooks/groupStudy/queries";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

export default function Member() {
  const { id } = useParams<{ id: string }>() || {};

  const { data } = useGroupsMemberActivityQuery(id, { enabled: !!id });

  const { data: groupData } = useGroupIdQuery(id, { enabled: !!id });

  const [users, setUsers] = useState<
    {
      gatherCount: number;
      totalCount: number;
      user: IUserSummary;
      randomId?: number;
      deposit: number;
      lastMonthAttendance: boolean;
      monthAttendance: boolean;
    }[]
  >([]);

  useEffect(() => {
    if (!data || !groupData) return;
    const groupMembers = groupData?.participants?.map((par) => {
      const findWho = data?.find((who) => who?.user === par?.user?._id);
      return {
        ...par,
        gatherCount: findWho?.monthGatherCount,
        totalCount: findWho?.totalGatherCount,
      };
    });
    setUsers(groupMembers);
  }, [data, groupData]);

  console.log(data);
  return (
    <>
      <Header title="모임 참여 횟수" />
      <Slide>
        <Box>
          <Flex direction="column">
            {users
              ?.slice()
              ?.sort((a, b) => {
                // 1순위: 이번달 모임 참여 횟수
                if ((b.gatherCount || 0) !== (a.gatherCount || 0)) {
                  return (b.gatherCount || 0) - (a.gatherCount || 0);
                }

                // 2순위: 전체 모임 참여 횟수
                if ((b.totalCount || 0) !== (a.totalCount || 0)) {
                  return (b.totalCount || 0) - (a.totalCount || 0);
                }

                // 3순위: 이름 오름차순
                if (!a.user || !b.user) return 1;
                return a.user.name.localeCompare(b.user.name);
              })
              .map((who, idx) => (
                <Box key={idx}>
                  <ProfileCommentCard
                    user={who.user}
                    comment={{
                      comment: `보유 보증금: ${who?.deposit || 0} Point`,
                    }}
                    isNoBorder
                    rightComponent={
                      <Box fontSize="12px" mr={3}>
                        이번 달 <b>{who?.gatherCount}회</b> / 누적 <b>{who?.totalCount}회</b>
                      </Box>
                    }
                  />
                  <Flex></Flex>
                </Box>
              ))}
          </Flex>
        </Box>
      </Slide>
    </>
  );
}
