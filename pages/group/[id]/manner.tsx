import { Box, Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";

import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProfileCommentCard from "../../../components/molecules/cards/ProfileCommentCard";
import GradeGauge from "../../../components/molecules/GradeGauge";
import { useGroupIdMannerQuery, useGroupIdQuery } from "../../../hooks/groupStudy/queries";

export default function Manner() {
  const { id } = useParams<{ id: string }>() || {};

  const { data: groupData } = useGroupIdQuery(id, { enabled: !!id });

  const { data } = useGroupIdMannerQuery(id, { enabled: !!id });

  const mergedParticipants =
    groupData &&
    data &&
    [...(groupData?.participants ? groupData.participants : [])]?.map((p) => {
      const grade = data[p.user.uid] as {
        great: number;
        good: number;
        soso: number;
        block: number;
      };

      return {
        ...p,
        grade,
      };
    });

  return (
    <>
      <Header title="멤버 후기 지표" />
      <Slide>
        <Box>
          <Flex direction="column">
            {mergedParticipants
              ?.sort((a, b) => (!a.user || !b.user ? 1 : a.user.name > b.user.name ? 1 : -1))
              .map((who, idx) => {
                const calculateGrade = (grade: {
                  great: number;
                  good: number;
                  soso: number;
                  block: number;
                }) => {
                  if (!grade) {
                    return { total: 0, value: 50 };
                  }
                  const { great, good, soso, block } = grade;
                  const total = great + good + soso + block;

                  let value;

                  const greatPer = (great / total) * 100;
                  const goodPer = ((great + good) / total) * 100;

                  if (greatPer >= 70 && goodPer >= 90) value = 100;
                  else if (goodPer >= 85) value = 75;
                  else if (goodPer >= 75) value = 50;
                  else if ((block / total) * 100 < 20) {
                    value = 25;
                  } else value = 0;

                  return { total, value };
                };
                const { total, value } = calculateGrade(who?.grade);

                return (
                  <Box key={idx}>
                    <ProfileCommentCard
                      user={who.user}
                      comment={{
                        comment: who.user.comment,
                      }}
                      rightComponent={
                        <Box>
                          <GradeGauge value={value} label={total + ""} />
                        </Box>
                      }
                      isNoBorder
                    />
                  </Box>
                );
              })}
          </Flex>{" "}
        </Box>
      </Slide>
    </>
  );
}
