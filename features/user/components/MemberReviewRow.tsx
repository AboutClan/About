import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import { memo, useState } from "react";

import Avatar from "@/components/atoms/Avatar";
import Textarea from "@/components/atoms/Textarea";
import { CheckCircleIcon } from "@/components/Icons/CircleIcons";
import ProfileCommentCard from "@/components/molecules/cards/ProfileCommentCard";
import { UserRating } from "@/features/user/hooks/mutations";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";

/* ================= 아바타 관련 상수 & 컴포넌트 (컴포넌트 밖) ================= */

type AvatarOption = { type: number; text: string; rating: UserRating; bg: number };

export const avatarArr: AvatarOption[] = [
  { type: 20, bg: 1, text: "최고예요😘", rating: "great" },
  { type: 11, bg: 6, text: "좋아요😉 ", rating: "good" },
  { type: 12, bg: 2, text: "그냥 그래요😑", rating: "soso" },
  { type: 28, bg: 0, text: "불편해요🫤", rating: "block" },
];

// 아바타 줄: rating이 바뀔 때만 리렌더되도록 memo + 커스텀 비교
type RatingAvatarRowProps = {
  myRating: UserRating | null;
  onChangeRating: (rating: UserRating) => void;
};

export const RatingAvatarRow = memo(
  function RatingAvatarRow({ myRating, onChangeRating }: RatingAvatarRowProps) {
    return (
      <Flex justify="space-between">
        {avatarArr.map((props) => {
          const isChecked = myRating === props.rating;

          return (
            <Button
              key={props.rating}
              opacity={isChecked ? 1 : 0.5}
              w="72px"
              h="100px"
              variant="nostyle"
              display="flex"
              flexDir="column"
              onClick={() => onChangeRating(props.rating)}
            >
              <Avatar
                isSquare
                user={{ avatar: { type: props.type, bg: isChecked ? props.bg : 0 } }}
                size="xl1"
                isLink={false}
              />

              <Box mt={3} fontSize="13px" fontWeight="semibold" color="gray.700">
                {props.text}
              </Box>
            </Button>
          );
        })}
      </Flex>
    );
  },
  (prev, next) => prev.myRating === next.myRating,
);

// 멤버 한 줄을 담당하는 Row 컴포넌트
type MemberReviewRowProps = {
  user: UserSimpleInfoProps;
  myRating: UserRating | null;
  initialMessage?: string;
  onChangeRating: (rating: UserRating | null) => void;
  onChangeMessage: (message: string) => void; // 부모 state는 안 바꾸고 ref만 업데이트 용도
};

export const MemberReviewRow = memo(function MemberReviewRow({
  user,
  myRating,
  initialMessage = "",
  onChangeRating,
  onChangeMessage,
}: MemberReviewRowProps) {
  // 메시지는 로컬 상태로만 관리 (부모 state 건드리지 않음)
  const [message, setMessage] = useState<string>(initialMessage);

  const handleRatingClick = (rating: UserRating | null) => {
    onChangeRating(rating);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value); // 이 Row만 리렌더
    onChangeMessage(value); // 부모는 ref에만 저장, state 변경 없음
  };

  return (
    <Stack pt={1} pb={3} borderBottom="var(--border)" key={user.uid}>
      <ProfileCommentCard
        user={user}
        memo={user.comment}
        rightComponent={
          <Flex>
            <Button
              size="sm"
              leftIcon={<CheckCircleIcon size="sm" color={myRating ? "gray" : "white"} isFill />}
              colorScheme={myRating ? "gray" : "mint"}
              onClick={() => handleRatingClick(null)}
            >
              PASS
            </Button>
          </Flex>
        }
      />

      <RatingAvatarRow myRating={myRating} onChangeRating={(rating) => handleRatingClick(rating)} />

      {myRating === "great" && (
        <Box my={3}>
          <Textarea
            value={message}
            onChange={handleTextareaChange}
            placeholder="상대에게 익명 후기를 보낼 수 있어요! 따뜻한 말 한마디가 그 사람의 받은 후기에 차곡차곡 쌓입니다 :)"
            minH="80px"
          />
        </Box>
      )}

      {myRating === "block" && (
        <Box my={3}>
          <Textarea
            value={message}
            onChange={handleTextareaChange}
            placeholder="추가로 공유하고 싶은 사유가 있다면 적어주세요! 작성 내용은 운영진만 확인하며, 익명이 보장됩니다. 비슷한 평가가 반복되는지 확인하겠습니다."
            minH="80px"
          />
        </Box>
      )}
    </Stack>
  );
});
