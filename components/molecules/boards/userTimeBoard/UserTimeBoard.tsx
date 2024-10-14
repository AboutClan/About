import { Box, Flex } from "@chakra-ui/react";
import { STUDY_VOTE_HOUR_ARR } from "../../../../constants/serviceConstants/studyConstants/studyTimeConstant";
import { TimeRangeProps } from "../../../../types/models/utilTypes";

import { IHighlightedText } from "../../../atoms/HighlightedText";
import BoardUserBlocks from "./_component/BoardUserBlocks";

export interface ITimeBoardParticipant {
  name: string;
  time: TimeRangeProps;
}

interface ITimeBoard {
  headerText: IHighlightedText;
  members: ITimeBoardParticipant[];
}

export default function UserTimeBoard({ members, headerText }: ITimeBoard) {
  return (
    <Box h="300px" position="relative">
      <Flex h="100%" w="100%" position="absolute">
        {STUDY_VOTE_HOUR_ARR.map((hour) => (
          <Flex direction="column" align="center" flex={1}>
            <Box py="6px" color="gray.500" fontSize="11px">
              {hour}
            </Box>
            <Box w="1px" h="100%" bg="gray.100" />
          </Flex>
        ))}
      </Flex>
      <Box position="absolute" mt="30px">
        <BoardUserBlocks members={members} />
      </Box>
    </Box>
  );
}
