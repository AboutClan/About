import { Box, Flex } from "@chakra-ui/react";

import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import { POINT_SYSTEM_PLUS } from "../../constants/serviceConstants/pointSystemConstants";
import { StudyWaitingUser } from "../../types/models/studyTypes/studyInterActions";
interface StudyWaitingUsersProps {
  studyWaitingUsers: StudyWaitingUser[];
}

function StudyWaitingUsers({ studyWaitingUsers }: StudyWaitingUsersProps) {
  console.log(1, studyWaitingUsers);
  const userCardArr: IProfileCommentCard[] = studyWaitingUsers.map((par, idx) => {
    const text = par.place.branch + " " + par.subPlace.map((place) => place.branch).join(" ");
    console.log(2, text);
    return {
      user: par.user,
      comment: text,
      leftComponent:
        idx < 8 ? (
          <i
            className={`fa-light fa-circle-${idx + 1} fa-2xl`}
            style={{ color: "var(--color-mint)" }}
          />
        ) : (
          <i className="fa-solid fa-circle-minus" />
        ),
      rightComponent: (
        <Box fontSize="16px" color="var(--color-mint)">
          + {getPoint(idx, par.subPlace.length)} POINT
        </Box>
      ),
    };
  });
  console.log(studyWaitingUsers);
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

const getPoint = (idx: number, subPlaceCnt: number) => {
  let value = POINT_SYSTEM_PLUS.STUDY_VOTE.basic.value;
  let subCntValue = subPlaceCnt >= 5 ? 5 : subPlaceCnt;

  if (idx === 0) value += POINT_SYSTEM_PLUS.STUDY_VOTE.first.value;
  if (idx === 1) value += POINT_SYSTEM_PLUS.STUDY_VOTE.second.value;
  if (idx === 2) value += POINT_SYSTEM_PLUS.STUDY_VOTE.third.value;

  return value + subCntValue;
};

export default StudyWaitingUsers;
