import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";

import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";
import StarRating from "../atoms/StarRating";

interface StarRatingReviewBlockProps {
  rating: number;
  date: string;
  text: string;
  size: "sm" | "lg";
  user?: Partial<UserSimpleInfoProps>;
}

function StarRatingReviewBlock({ rating, date, text, size, user }: StarRatingReviewBlockProps) {
  return (
    <Flex flexDir="column">
      <Flex align="center">
        <Avatar
          user={user as UserSimpleInfoProps}
          size="xs1"
          isLink={user.name !== "어바웃" && user.name !== "익명"}
        />
        <Flex h="30px" ml={2} flexDir="column" align="start">
          <Box fontSize="11px" color="gray.800">
            {user.name}
          </Box>
          <Box mt="auto" fontSize="10px" color="gray.500" lineHeight="12px">
            {dayjsToFormat(dayjs(date), "YYYY.MM.DD")}
          </Box>
        </Flex>
      </Flex>
      <Flex align="start" color="gray.500" my={2} ml={0.5}>
        <Box mt="1.5px">
          <StarRating rating={rating} size={size} />
        </Box>
        <Box
          ml={2}
          fontSize="12px"
          color="gray.700"
          display="-webkit-box"
          overflow="hidden"
          textOverflow="ellipsis"
          sx={{
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {text}
        </Box>
      </Flex>
    </Flex>
  );
}

export default StarRatingReviewBlock;
