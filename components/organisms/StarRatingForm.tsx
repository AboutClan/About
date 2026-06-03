/* eslint-disable */

import { Box, Flex, FormControl } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { CAFE_REVIEW_ARR, STUDY_PLACE, STUDY_VOTE } from "../../constants/keys/queryKeys";
import { useToast } from "../../hooks/custom/CustomToast";

import { useStudyPlaceReviewMutation } from "../../hooks/study/mutations";
import { ModalLayout } from "../../modals/Modals";
import { Input } from "../atoms/Input";
import Textarea from "../atoms/Textarea";
import { StarIcon } from "../Icons/StarIcon";
import BottomNav from "../layouts/BottomNav";

export interface PlaceReviewProps2 {
  mood: number;
  table: number;
  space: number;
  etc: number;
  comment: string;
  name: string;
}

function ReviewForm({ placeId, onClose }: { placeId: string; onClose: () => void }) {
  const toast = useToast();
  const [text, setText] = useState<string>("");
  const [isNicknameModal, setIsNicknameModal] = useState(false);
  const [nickname, setNickname] = useState("");

  const queryClient = useQueryClient();

  const { mutate, isLoading } = useStudyPlaceReviewMutation(placeId, {
    onSuccess() {
      const savedIds = localStorage.getItem(CAFE_REVIEW_ARR);
      const parsedIds: string[] = savedIds ? JSON.parse(savedIds) : [];
      localStorage.setItem(CAFE_REVIEW_ARR, JSON.stringify([...parsedIds, placeId]));
      queryClient.invalidateQueries({ queryKey: [STUDY_VOTE], exact: false });
      queryClient.invalidateQueries({ queryKey: [STUDY_PLACE], exact: false });
      toast("success", "리뷰 작성 완료!");
      onClose();
    },
  });

  const [review, setReview] = useState<PlaceReviewProps2>({
    mood: 3,
    table: 3,
    space: 3,
    etc: 3,
    comment: "",
    name: "",
  });

  const handleSubmit = (type: "1" | "2") => {
    if (type === "1" && (nickname.trim().length > 5 || nickname.trim().length < 1)) {
      toast("warning", "닉네임 글자 수를 확인해 주세요!");
      return;
    }
    mutate({ ...review, comment: text, name: nickname.trim() || "익명" });
  };

  return (
    <Flex flexDir="column" position="relative" minHeight="calc(100dvh - var(--header-h))">
      <Flex flexDir="column" lineHeight={1.8} mt={2} mb={10}>
        <Box as="span" fontSize="24px" fontWeight={600} lineHeight="36px" color="gray.800" mb={2}>
          카페는 공부하기에 어떤가요?
        </Box>
        <Box as="span" fontSize="13px" lineHeight="20px" color="gray.600">
          카공러 입장에서의 솔직한 리뷰를 남겨주세요!
        </Box>
      </Flex>
      <Flex flexDir="column" mb={5}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          공부 분위기인가요?
        </Box>
        <StarBlock
          rating={review.mood}
          setRating={(value: number) => setReview((old) => ({ ...old, mood: value }))}
        />
      </Flex>
      <Flex flexDir="column" mb={5}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          콘센트/테이블
        </Box>
        <StarBlock
          rating={review.table}
          setRating={(value: number) => setReview((old) => ({ ...old, table: value }))}
        />
      </Flex>
      <Flex flexDir="column" mb={5}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          혼잡도 & 자리 여유
        </Box>
        <StarBlock
          rating={review.space}
          setRating={(value: number) => setReview((old) => ({ ...old, space: value }))}
        />
      </Flex>
      <Flex flexDir="column" mb={5}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          기타
        </Box>
        <StarBlock
          rating={review.etc}
          setRating={(value: number) => setReview((old) => ({ ...old, etc: value }))}
        />
      </Flex>
      <FormControl mt={2} mb={3}>
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
      <BottomNav isSlide={false} text="평가 완료" onClick={() => setIsNicknameModal(true)} />
      {isNicknameModal && (
        <ModalLayout
          title="닉네임을 사용할까요?"
          setIsModal={setIsNicknameModal}
          isCloseButton={false}
          footerOptions={{
            main: { text: "닉네임 제출", func: () => handleSubmit("1"), isLoading },
            sub: { text: "익명 제출", func: () => handleSubmit("2") },
          }}
        >
          <Box>
            <Input
              placeholder="닉네임 (다섯 글자 이내)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={5}
              size="md"
            />
          </Box>
        </ModalLayout>
      )}
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
          onClick={() => setRating(star)}
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
