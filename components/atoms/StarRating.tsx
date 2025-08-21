import { Box, Flex } from "@chakra-ui/react";

import { StarIcon } from "../Icons/StarIcon";

interface StarRatingProps {
  rating: number;
  size: "sm" | "md" | "lg";
}

function StarRating({ rating, size }: StarRatingProps) {
  return (
    <Flex>
      {[1, 2, 3, 4, 5].map((star) => {
        const starType =
          star <= rating ? "fill" : star > rating && star < rating + 1 ? "half" : "empty";

        return (
          <Box key={star}>
            <StarIcon type={starType} size={size} />
          </Box>
        );
      })}
    </Flex>
  );
}

export default StarRating;
