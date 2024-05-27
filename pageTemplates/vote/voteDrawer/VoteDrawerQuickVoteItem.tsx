import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

import { DispatchType } from "../../../types/hooks/reactTypes";
import { IPlace } from "../../../types/models/studyTypes/studyDetails";
import { IStudyVoteWithPlace } from "../../../types/models/studyTypes/studyInterActions";

interface VoteDrawerQuickVoteItemProps {
  savedPreferPlace: { place: IPlace; subPlace: IPlace[] };
  setMyVote: DispatchType<IStudyVoteWithPlace>;
}

function VoteDrawerQuickVoteItem({ savedPreferPlace, setMyVote }: VoteDrawerQuickVoteItemProps) {
  const favoritesCnt = (savedPreferPlace?.place ? 1 : 0) + savedPreferPlace?.subPlace?.length;
  return (
    <Flex
      py="8px"
      align="center"
      pl="16px"
      pr="20px"
      borderBottom="var(--border-main)"
      onClick={() =>
        setMyVote((old) => ({
          ...old,
          place: savedPreferPlace.place,
          subPlace: savedPreferPlace.subPlace,
        }))
      }
      as="button"
      w="100%"
    >
      <HeartButton>
        <i className="fa-solid fa-circle-check fa-lg" />
      </HeartButton>

      <Flex direction="column" align="flex-start">
        <Box fontWeight={600} fontSize="16px">
          빠른 투표
        </Box>
        <Box color="var(--gray-600)" fontSize="14px">
          <Box as="span">등록된 장소:{favoritesCnt}개</Box>
        </Box>
      </Flex>
    </Flex>
  );
}

const HeartButton = styled.div`
  color: var(--color-mint);
  padding: 8px;
  margin-right: 12px;
`;

export default VoteDrawerQuickVoteItem;
