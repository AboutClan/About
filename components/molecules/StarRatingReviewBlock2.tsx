import { Box, Flex, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";

import { StudyRatingProps } from "../../types/models/studyTypes/study-entity.types";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";
import StarRating from "../atoms/StarRating";
import { StarIcon } from "../Icons/StarIcon";

interface StarRatingReviewBlockProps {
  review: StudyRatingProps;
  idx: number;
}

function StarRatingReviewBlock2({ review, idx }: StarRatingReviewBlockProps) {
  const { etc, mood, space, table, comment, createdAt } = review;

  const total = (etc + mood + space + table) / 4;
 
  return (
    <Flex flexDir="column">
      <Flex align="center" justify="space-between">
        <Flex>
          <Avatar
            user={{
              avatar: {
                type: Math.ceil(Math.random() * 35),
                bg: Math.ceil(Math.random() * 10),
              },
            }}
            size="xs1"
            isLink={false}
          />
          <Flex h="30px" ml={2} flexDir="column" align="start">
            <Box fontSize="11px" color="gray.800">
              익명 {idx}
            </Box>
            <Box mt="auto" fontSize="10px" color="gray.500" lineHeight="12px">
              {dayjsToFormat(dayjs(createdAt), "YYYY.MM.DD")}
            </Box>
          </Flex>
        </Flex>
        <Flex mt={0.5} align="center">
          <Box>
            <StarRating rating={total} size="lg" />
          </Box>
          <Box fontWeight={600} fontSize="16px" mb="-2px" ml={1.5} mr={1}>
            {total?.toFixed(1)}
          </Box>
        </Flex>
      </Flex>
      {comment && (
        <Box mt={3} ml={1} fontSize="12px" color="gray.600">
          {comment}
        </Box>
      )}
      <Flex align="start" color="gray.500" mt={1} mb={2} ml={0.5}>
        <Grid
          gridTemplateColumns="repeat(2,1fr)"
          gridGap="4px"
          fontSize="12px"
          mt={2}
          bg="gray.100"
          w="full"
          px={3}
          py={2}
          borderRadius="8px"
          color="gray.800"
          mb={1}
        >
          <Flex>
            <Box w="56px">공부 분위기</Box>
            <Box mx="1px">
              <StarIcon type="empty" size="md" />
            </Box>
            {mood?.toFixed(1)}
          </Flex>
          <Flex ml="-2px">
            <Box>콘센트/테이블</Box>
            <Box mx="1px">
              <StarIcon type="empty" size="md" />
            </Box>
            {table?.toFixed(1)}
          </Flex>
          <Flex>
            <Box>자리 여유</Box>
            <Box mx="1px">
              <StarIcon type="empty" size="md" />
            </Box>
            {space?.toFixed(1)}
          </Flex>
          <Flex ml="-2px">
            기타
            <Box mx="1px">
              <StarIcon type="empty" size="md" />
            </Box>
            {etc?.toFixed(1)}
          </Flex>
        </Grid>
      </Flex>
    </Flex>
  );
}

export default StarRatingReviewBlock2;
