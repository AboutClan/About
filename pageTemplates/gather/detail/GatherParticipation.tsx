import { Badge, Box, Flex } from "@chakra-ui/react";

import ParticipationBar from "../../../components/atoms/bars/ParticipationBar";
import { IProfileCommentCard } from "../../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../../components/organisms/ProfileCardColumn";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";

interface IGatherParticipation {
  data: IGather;
}

function GatherParticipation({ data }: IGatherParticipation) {
  const status = data.status;
  const participantsCnt = data.participants.length;

  const organizerCard = {
    user: data?.user as IUser,
    memo: (data?.user as IUser).comment,
    rightComponent: (
      <Box>
        <Badge variant="subtle" size="lg" colorScheme="mint">
          모임장
        </Badge>
      </Box>
    ),
  };

  const userCardArr: IProfileCommentCard[] = (data?.participants ? [...data.participants] : []).map(
    (par) => ({
      user: par.user,
      memo: par.user.comment,
      rightComponent: (
        <Box>
          <Badge variant="subtle" size="lg" colorScheme="blue">
            {par.phase === "first" ? 1 : 2}차 참여
          </Badge>
        </Box>
      ),
    }),
  );

  return (
    <>
      <Flex flexDir="column" px={5}>
        <ParticipationBar
          type={status as "open" | "pending"}
          participantsCnt={participantsCnt}
          maxCnt={data?.memberCnt.max}
        />
        <ProfileCardColumn hasCommentButton={false} userCardArr={[organizerCard, ...userCardArr]} />
      </Flex>
    </>
  );
}

export default GatherParticipation;
