import { Box, Flex, FormControl, Switch } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import { ABOUT_USER_SUMMARY } from "../../constants/serviceConstants/userConstants";
import { PlaceReviewProps } from "../../types/models/studyTypes/entityTypes";
import { UserSimpleInfoProps } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar"; // 작성자 아바타
import InfoList from "../atoms/lists/InfoList";
import Textarea from "../atoms/Textarea";
import { StarIcon } from "../Icons/StarIcon";
import BottomNav from "../layouts/BottomNav";

interface ReviewFormProps {
  onSubmit: (data: Partial<PlaceReviewProps>) => void;
  user?: Partial<UserSimpleInfoProps>;
}

function ReviewForm({ onSubmit, user }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState<string>("");
  const [isSecret, setIsSecret] = useState(false);

  const handleSubmit = () => {
    if (!text.trim() || rating === 0) return;

    onSubmit({ rating, review: text, isSecret });
    setRating(0);
    setText("");
  };

  return (
    <Flex flexDir="column">
      <Flex align="center" justify="space-between">
        <Flex>
          <Avatar user={isSecret ? ABOUT_USER_SUMMARY : (user as UserSimpleInfoProps)} size="xs1" />
          <Flex h="30px" ml={2} flexDir="column" align="start">
            <Box fontSize="11px" color="gray.800">
              {isSecret ? "익명" : user?.name}
            </Box>
            <Box mt="auto" fontSize="10px" color="gray.500" lineHeight="12px">
              {dayjsToFormat(dayjs(), "YYYY.MM.DD")}
            </Box>
          </Flex>
        </Flex>
        <Flex align="center">
          <Box fontSize="11px" fontWeight={500} mr={2}>
            {isSecret ? "익명" : "실명"}
          </Box>
          <Switch
            isChecked={!isSecret}
            onChange={() => setIsSecret((old) => !old)}
            colorScheme="mint"
          />
        </Flex>
      </Flex>

      <Flex align="center" mt={2} ml={0.5}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Box
            key={star}
            as="button"
            onClick={() => setRating(star)}
            cursor="pointer"
            mt="1.5px"
            pr="1"
          >
            <StarIcon type={star <= rating ? "fill" : "empty"} size="xl" />
          </Box>
        ))}
      </Flex>

      <FormControl mt={3} mb={3}>
        <Textarea
          placeholder="짧은 카페 후기를 작성해주세요"
          fontSize="12px"
          resize="vertical"
          minH="100px"
          value={text}
          onChange={(e) => setText(e.target.value)}
          color="gray.700"
        />
      </FormControl>
      <InfoList items={INFO_ARR} />
      <BottomNav isSlide={false} text="작성 완료" onClick={handleSubmit} />
    </Flex>
  );
}

export default ReviewForm;

const INFO_ARR = [
  "실명은 100 Point, 익명은 30 Point가 적립됩니다.",
  "솔직한 리뷰는 더 좋은 스터디 장소를 결정하는 힘이 됩니다.",
];
