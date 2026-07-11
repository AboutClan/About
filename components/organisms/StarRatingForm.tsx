/* eslint-disable */

import { Box, Flex, FormControl } from "@chakra-ui/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { CAFE_REVIEW_ARR, STUDY_PLACE, STUDY_VOTE } from "../../constants/keys/queryKeys";
import { usePointToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";

import { useStudyPlaceReviewMutation } from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { ModalLayout } from "../../modals/Modals";
import Textarea from "../atoms/Textarea";
import { StarIcon } from "../Icons/StarIcon";
import BottomNav from "../layouts/BottomNav";

export interface PlaceReviewProps2 {
  mood: number;
  power: number;
  space: number;
  etc: number;
  comment: string;
  name: string;
}

function ReviewForm({ placeId, onClose }: { placeId: string; onClose: () => void }) {
  const toast = useToast();
  const pointToast = usePointToast();
  const [text, setText] = useState<string>("");
  const [isNicknameModal, setIsNicknameModal] = useState(false);

  const userInfo = useUserInfo();
  const queryClient = useQueryClient();

  const { mutate: updatePoint } = usePointSystemMutation("point");

  const { mutate, isLoading } = useStudyPlaceReviewMutation(placeId, {
    onSuccess() {
      const savedIds = localStorage.getItem(CAFE_REVIEW_ARR);
      const parsedIds: string[] = savedIds ? JSON.parse(savedIds) : [];
      localStorage.setItem(CAFE_REVIEW_ARR, JSON.stringify([...parsedIds, placeId]));
      queryClient.invalidateQueries({ queryKey: [STUDY_VOTE], exact: false });
      queryClient.invalidateQueries({ queryKey: [STUDY_PLACE], exact: false });
      toast("success", "리뷰 작성 완료!");
      updatePoint({ value: 20, message: "카공 리뷰 작성", sub: "study" });
      pointToast(20);
      onClose();
    },
  });

  const [review, setReview] = useState<PlaceReviewProps2>({
    mood: 3,
    power: 3,
    space: 3,
    etc: 3,
    comment: "",
    name: "",
  });

  const handleSubmit = (type: "1" | "2") => {
    const nickname = userInfo?.role === "guest" ? "익명" : userInfo?.nickname || "익명";

    mutate({ ...review, comment: text, name: nickname.trim() });
  };

  const handleClick = () => {
    if (userInfo?.role === "guest") {
      setIsNicknameModal(true);
      return;
    }

    console.log(userInfo);
    return;
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
          공부하기 좋은 분위기인가요?
        </Box>
        <StarBlock
          rating={review.mood}
          setRating={(value: number) => setReview((old) => ({ ...old, mood: value }))}
        />
      </Flex>
      <Flex flexDir="column" mb={5}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          콘센트는 충분한가요?
        </Box>
        <StarBlock
          rating={review.power}
          setRating={(value: number) => setReview((old) => ({ ...old, power: value }))}
        />
      </Flex>
      <Flex flexDir="column" mb={5}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          자리는 여유로운가요?
        </Box>
        <StarBlock
          rating={review.space}
          setRating={(value: number) => setReview((old) => ({ ...old, space: value }))}
        />
      </Flex>
      <Flex flexDir="column" mb={5}>
        <Box color="gray.600" fontSize="13px" fontWeight={600}>
          기타 만족도
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
      <BottomNav isSlide={false} text="평가 완료" onClick={handleClick} />
      {isNicknameModal && (
        <ModalLayout
          title="등록을 완료할까요?"
          setIsModal={setIsNicknameModal}
          footerOptions={{
            main: { text: "게스트로 등록하기", func: () => handleSubmit("1"), isLoading },
            sub: { text: "카공지도 가입하기", func: () => handleSubmit("2") },
          }}
        >
          <Box>
            게스트로 이용 중이라 리워드가 지급되지 않아요.
            <br />
            카공지도 멤버는 활동할 때마다 <b>리워드 지급!</b>
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
