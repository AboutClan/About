import { Box, Flex } from "@chakra-ui/react";
import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import { StudyWaitingUser } from "../../types/models/studyTypes/studyInterActions";

interface StudyWaiterProps {
  studyWaitingUsers: StudyWaitingUser[];
}

function StudyWaiter({ studyWaitingUsers }: StudyWaiterProps) {
  const userCardArr: IProfileCommentCard[] = studyWaitingUsers.map((par, idx) => {
    return {
      user: par.user,
      comment: par.user.comment,
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
          + 10
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

export default StudyWaiter;
