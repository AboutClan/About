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
  return (
    <Flex
      pt="4px"
      pb="16px"
      w="100%"
      px="20px"
      h="84px"
      borderBottom="var(--border-main)"
      justify="space-between"
    >
      <Flex flex={0.9} direction="column" justify="space-between">
        <Box fontSize="18px" fontWeight={800}>
          {myVotePlace.fullname}
        </Box>
        <Flex fontSize="12px" align="center">
          <Flex direction="column">
            <Box color="var(--gray-800)" fontSize="14px">
              <Box as="span">{voteCnt}명 참여중</Box>
              {" / "}
              <Box as="span">즐겨찾기: {favoritesCnt}</Box>
            </Box>
            <Box>{myVotePlace.locationDetail}</Box>
          </Flex>
          <Button
            size="xs"
            ml="auto"
            onClick={() => setMyVote({ place: null, subPlace: [], start: null, end: null })}
          >
            선택 취소
          </Button>
        </Flex>
      </Flex>
      <Button w="60px" h="60px" colorScheme="mintTheme" onClick={() => setActionType("timeSelect")}>
        <Flex direction="column" h="100%" py="8px" justify="space-between" align="center">
          <Box fontSize="24px" mb="2px">
            <i className="fa-solid fa-circle-check " />
          </Box>
          <Box fontSize="13px" fontWeight={400}>
            결정
          </Box>
        </Flex>
      </Button>
    </Flex>
  );
}

export default VoteDrawerMainItem;
