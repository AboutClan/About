import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useRecoilValue } from "recoil";

import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import { POINT_SYSTEM_PLUS } from "../../constants/serviceConstants/pointSystemConstants";
import { studyDateStatusState } from "../../recoils/studyRecoils";
import { StudyWaitingUser } from "../../types/models/studyTypes/studyInterActions";
interface StudyWaitingUsersProps {
  studyWaitingUsers: StudyWaitingUser[];
}

function StudyWaitingUsers({ studyWaitingUsers }: StudyWaitingUsersProps) {
  const { date } = useParams<{ location: string; date: string }>() || {};
  const studyDateStatus = useRecoilValue(studyDateStatusState);

  let index = 0;
  const userCardArr: IProfileCommentCard[] = studyWaitingUsers.map((par, idx) => {
    const text = par.place.branch + " " + par.subPlace.map((place) => place.branch).join(" ");

    const isLate = dayjs(par.createdAt).isAfter(dayjs(date).subtract(1, "day").hour(23));
    if (!isLate) index++;

    return {
      user: par.user,
      comment: text,
      leftComponent: (
        <Box w="28px" h="28px" color="var(--color-mint)">
          {idx < 8 ? (
            <i className={`fa-light fa-circle-${idx + 1} fa-2xl`} />
          ) : (
            <i className="fa-light fa-circle-minus fa-2xl" />
          )}
        </Box>
      ),
      rightComponent: studyDateStatus === "not passed" && (
        <Box fontSize="16px" color="var(--color-mint)">
          + {getPoint(index - 1, isLate, par)} POINT
        </Box>
      ),
    };
  });

  return (
    <>
      {userCardArr.length ? (
        <ProfileCardColumn userCardArr={userCardArr} />
      ) : (
        <Flex
          align="center"
          justify="center"
          h="200"
          color="var(--gray-600)"
          fontSize="16px"
          textAlign="center"
        >
          <Box as="p" lineHeight="1.8">
            현재 참여중인 멤버가 없습니다.
            <br />
            지금 신청하면{" "}
            <Box as="b" color="var(--color-mint)">
              10 POINT
            </Box>{" "}
            추가 획득!
          </Box>
        </Flex>
      )}
    </>
  );
}

const getPoint = (idx: number, isLate: boolean, par: StudyWaitingUser) => {
  let value = isLate ? 2 : POINT_SYSTEM_PLUS.STUDY_VOTE.basic.value;

  const subPlaceCnt = par.subPlace.length;
  const subCntValue = subPlaceCnt >= 5 ? 5 : subPlaceCnt;

  if (!isLate) {
    if (idx === 0) value += POINT_SYSTEM_PLUS.STUDY_VOTE.first.value;
    if (idx === 1) value += POINT_SYSTEM_PLUS.STUDY_VOTE.second.value;
    if (idx === 2) value += POINT_SYSTEM_PLUS.STUDY_VOTE.third.value;
  }

  return value + subCntValue;
};

export default StudyWaitingUsers;
