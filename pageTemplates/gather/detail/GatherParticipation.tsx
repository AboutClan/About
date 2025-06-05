import { Flex } from "@chakra-ui/react";

import ParticipationBar from "../../../components/atoms/bars/ParticipationBar";
import { IProfileCommentCard } from "../../../components/molecules/cards/ProfileCommentCard";
import SocialingScoreBadge from "../../../components/molecules/SocialingScoreBadge";
import ProfileCardColumn from "../../../components/organisms/ProfileCardColumn";
import { IGather } from "../../../types/models/gatherTypes/gatherTypes";
import { IUser } from "../../../types/models/userTypes/userInfoTypes";

interface IGatherParticipation {
  data: IGather;
}

function GatherParticipation({ data }: IGatherParticipation) {
  const status = data.status;
  const participantsCnt = data.participants.length;
  console.log(data);
  const organizerCard = {
    user: data?.user as IUser,
    memo: (data?.user as IUser).comment,
    rightComponent: (
      <SocialingScoreBadge user={data?.user} size="sm" />
      // <Box>
      //   <Badge variant="subtle" size="lg" colorScheme="mint">
      //     모임장
      //   </Badge>
      // </Box>
    ),
  };

  const userCardArr: IProfileCommentCard[] = (data?.participants ? [...data.participants] : []).map(
    (par) => ({
      user: par.user,
      memo: par.user.comment,
      rightComponent: <SocialingScoreBadge user={par?.user} size="sm" />,
    }),
  );

  return (
    <>
      <Flex flexDir="column" px={5}>
        <ParticipationBar
          type={status as "open" | "pending"}
          participantsCnt={participantsCnt + 1}
          maxCnt={data?.memberCnt.max}
        />
        <ProfileCardColumn hasCommentButton={false} userCardArr={[organizerCard, ...userCardArr]} />
      </Flex>
    </>
  );
}

export default GatherParticipation;
