import { Box, Flex } from "@chakra-ui/react";
import styled from "styled-components";

interface VoteDrawerQuickVoteItemProps {
  preferPlaces: { main: string; sub: string[] };
  handleQuickVote: () => void;
}

function VoteDrawerQuickVoteItem({ preferPlaces, handleQuickVote }: VoteDrawerQuickVoteItemProps) {
  return (
    <Flex
      py="8px"
      align="center"
      pl="16px"
      pr="20px"
      borderBottom="var(--border-main)"
      onClick={handleQuickVote}
      as="button"
      w="100%"
    >
      <HeartButton>
        <i className="fa-solid fa-circle-check fa-lg" />
      </HeartButton>

      <Flex direction="column" align="flex-start">
        <Box fontWeight={600} fontSize="16px">
          1초 만에 스터디 투표하기
        </Box>
        <Box color="var(--gray-600)" fontSize="14px">
          {preferPlaces?.main ? (
            <Box as="span">
              즐겨찾기: {preferPlaces?.main} 외 {preferPlaces?.sub?.length + 1}곳
            </Box>
          ) : (
            <Box as="span">해당 지역에 즐겨찾기된 장소가 없습니다.</Box>
          )}
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
