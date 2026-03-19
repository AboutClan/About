/* eslint-disable */

import { Box, Flex, FormControl } from "@chakra-ui/react";
import { useState } from "react";

import { useStudyPlaceReviewMutation } from "../../hooks/study/mutations";
import Textarea from "../atoms/Textarea";
import { StarIcon } from "../Icons/StarIcon";
import BottomNav from "../layouts/BottomNav";

export interface PlaceReviewProps2 {
  mood: number;
  table: number;
  space: number;
  etc: number;
}

function ReviewForm({ placeId }: { placeId: string }) {
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [isSecret, setIsSecret] = useState(false);

  const { mutate } = useStudyPlaceReviewMutation(placeId);

  const [review, setReview] = useState<PlaceReviewProps2>({
    mood: 3,
    table: 3,
    space: 3,
    etc: 3,
  });

  const handleSubmit = () => {
    mutate(review);

    return;
    if (!text.trim() || rating === 0) return;

    // onSubmit({ rating, review: text, isSecret });
    setRating(0);
    setText("");
  };

  return (
    <Flex flexDir="column">
      <Flex flexDir="column" lineHeight={1.8} mt={2} mb={5}>
        <Box as="span" fontSize="24px" fontWeight={600} lineHeight="36px" color="gray.800" mb={2}>
          카페는 공부하기에 어떤가요?
        </Box>
        <Box as="span" fontSize="13px" lineHeight="20px" color="gray.600">
          솔직한 후기를 평가해 주세요!
        </Box>
      </Flex>
      <Flex flexDir="column" mb={3}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          공부 분위기
        </Box>
        <StarBlock
          rating={review.mood}
          setRating={(value: number) => {
            setReview((old) => ({ ...old, mood: value }));
          }}
        />
      </Flex>
      <Flex flexDir="column" mb={3}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          콘센트/테이블
        </Box>
        <StarBlock
          rating={review.table}
          setRating={(value: number) => {
            setReview((old) => ({ ...old, table: value }));
          }}
        />
      </Flex>
      <Flex flexDir="column" mb={3}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          혼잡도 & 자리 여유
        </Box>
        <StarBlock
          rating={review.space}
          setRating={(value: number) => {
            setReview((old) => ({ ...old, space: value }));
          }}
        />
      </Flex>
      <Flex flexDir="column" mb={3}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          기타
        </Box>
        <StarBlock
          rating={review.etc}
          setRating={(value: number) => {
            setReview((old) => ({ ...old, etc: value }));
          }}
        />
      </Flex>{" "}
      <FormControl mt={3} mb={3}>
        <Textarea
          placeholder="(선택) 카페 후기를 작성할 수 있습니다. 해당 내용은 다른 사람들에게 공유됩니다."
          fontSize="12px"
          resize="vertical"
          minH="100px"
          value={text}
          onChange={(e) => setText(e.target.value)}
          color="gray.700"
        />
      </FormControl>
      <BottomNav isSlide={false} text="평가 완료" onClick={handleSubmit} />
    </Flex>
  );
}

function StarBlock({ rating, setRating }: { rating: number; setRating: (value: number) => void }) {
  return (
    <Flex align="center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Box
          key={star}
          as="button"
          onClick={() => {
            setRating(star);
          }}
          cursor="pointer"
          mt="1.5px"
          pr="1"
        >
          <StarIcon type={star <= rating ? "fill" : "empty"} size="xl" />
        </Box>
      ))}
    </Flex>
  );
}

export default ReviewForm;

const INFO_ARR = [
  "실명은 100 Point, 익명은 30 Point가 적립됩니다.",
  "솔직한 리뷰는 더 좋은 스터디 장소를 결정하는 힘이 됩니다.",
];
