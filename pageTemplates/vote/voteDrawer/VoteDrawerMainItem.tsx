import { Box, Button, Flex } from "@chakra-ui/react";

import { StudyVoteMapActionType } from "../../../pages/vote";
import { DispatchType } from "../../../types/hooks/reactTypes";
import { IPlace } from "../../../types/models/studyTypes/studyDetails";
import { IStudyVoteWithPlace } from "../../../types/models/studyTypes/studyInterActions";

interface VoteDrawerMainItemProps {
  voteCnt: number;
  favoritesCnt: number;
  myVotePlace: IPlace;
  setMyVote: DispatchType<IStudyVoteWithPlace>;
  setActionType: DispatchType<StudyVoteMapActionType>;
}

function VoteDrawerMainItem({
  voteCnt,
  favoritesCnt,
  myVotePlace,
  setMyVote,
  setActionType,
}: VoteDrawerMainItemProps) {
  const handleCancel = () => {
    setMyVote({ place: null, subPlace: [], start: null, end: null });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setActionType("timeSelect");
  };

  return (
    <Flex
      pt="4px"
      pb="16px"
      w="100%"
      px="20px"
      borderBottom="var(--border-main)"
      justify="space-between"
      onClick={handleCancel}
    >
      <Flex flex={0.9} direction="column" justify="space-between">
        <Box fontSize="18px" fontWeight={800}>
          {myVotePlace.fullname}
        </Box>
        <Flex fontSize="12px" align="flex-end" mt="4px">
          <Flex direction="column">
            <Box color="var(--color-mint)" fontSize="12px">
              <Box as="span">{voteCnt}명 참여중</Box>
              {" / "}
              <Box as="span">즐겨찾기: {favoritesCnt}명</Box>
            </Box>
            <Box color="var(--gray-600)">{myVotePlace.locationDetail}</Box>
          </Flex>
        </Flex>
      </Flex>
      <Button
        fontSize="14px"
        aspectRatio={1}
        h="100%"
        colorScheme="mintTheme"
        onClick={(e) => handleSubmit(e)}
      >
        <Flex direction="column" h="100%" py="8px" justify="space-between" align="center">
          <Box fontSize="24px" mb="4px">
            <i className="fa-solid fa-circle-check " />
          </Box>
          <Box fontWeight={400}>결정</Box>
        </Flex>
      </Button>
    </Flex>
  );
}

export default VoteDrawerMainItem;
