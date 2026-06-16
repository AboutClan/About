import { Box, Flex, Grid } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRef, useState } from "react";

import { BLOCKED_CAFE_REVIEWERS } from "../../constants/keys/localStorage";
import { useToast } from "../../hooks/custom/CustomToast";
import { useUserRequestMutation } from "../../hooks/user/sub/request/mutations";
import { StudyRatingProps } from "../../types/models/studyTypes/study-entity.types";
import { dayjsToFormat } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";
import StarRating from "../atoms/StarRating";
import { StarIcon } from "../Icons/StarIcon";

interface StarRatingReviewBlockProps {
  review: StudyRatingProps;
  idx: number;
}

const getBlockedList = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(BLOCKED_CAFE_REVIEWERS) ?? "[]");
  } catch {
    return [];
  }
};

const saveBlockedList = (list: string[]) => {
  localStorage.setItem(BLOCKED_CAFE_REVIEWERS, JSON.stringify(list));
};

function StarRatingReviewBlock2({ review, idx }: StarRatingReviewBlockProps) {
  const { etc, mood, space, power, comment, createdAt } = review;
  const total = (etc + mood + space + power) / 4;
  const reviewerId = review.user;

  // ── 모든 hooks를 최상단에 선언 (early return 전에 위치 금지) ──
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(
    () => !!(reviewerId && getBlockedList().includes(reviewerId)),
  );
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const { mutate: sendRequest } = useUserRequestMutation({
    onSuccess() {
      toast("success", "신고가 접수되었어요. 운영진 검토 후 처리됩니다.");
    },
    onError() {
      toast("error", "신고 접수에 실패했어요. 다시 시도해 주세요.");
    },
  });

  const handleReport = () => {
    setMenuOpen(false);
    const displayName = review.name && review.name !== "익명" ? review.name : `익명 ${idx}`;
    sendRequest({
      category: "신고",
      title: "카공 후기 신고",
      content: `작성자: ${displayName}\n후기 내용: ${review.comment ?? "(내용 없음)"}`,
    });
  };

  const handleBlock = () => {
    setMenuOpen(false);
    if (!reviewerId) {
      toast("error", "운영진이 등록한 후기는 차단할 수 없어요.");
      return;
    }
    const current = getBlockedList();
    if (!current.includes(reviewerId)) {
      saveBlockedList([...current, reviewerId]);
    }
    setIsBlocked(true);
    toast("success", "해당 후기가 차단되었어요.");
  };

  if (isBlocked) return null;

  return (
    <Flex flexDir="column" pos="relative">
      <Flex align="center" justify="space-between">
        <Flex>
          <Avatar
            user={{
              avatar: {
                type: ((idx * 13) % 35) + 1,
                bg: ((idx * 7) % 8) + 1,
              },
            }}
            size="xs1"
            isLink={false}
          />
          <Flex h="30px" ml={2} flexDir="column" align="start">
            <Box fontSize="11px" color="gray.800">
              {!review?.name || review?.name === "익명" ? `익명 ${idx}` : review.name}
            </Box>
            <Box mt="auto" fontSize="10px" color="gray.500" lineHeight="12px">
              {createdAt ? dayjsToFormat(dayjs(createdAt), "YYYY.MM.DD") : "2026년 5월 17일"}
            </Box>
          </Flex>
        </Flex>

        {/* 신고/차단 메뉴 버튼 */}
        {review?.name !== "어바웃 AI" && (
          <Box ml={2} mr="auto" pos="relative">
            <Box
              as="button"
              ref={menuBtnRef}
              fontSize="18px"
              color="gray.400"
              lineHeight="1"
              px={1}
              py={0.5}
              borderRadius="4px"
              _hover={{ color: "gray.600", bg: "gray.100" }}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="더보기"
            >
              ⋯
            </Box>

            {menuOpen && (
              <>
                <Box pos="fixed" inset={0} zIndex={999} onClick={() => setMenuOpen(false)} />
                <Box
                  pos="absolute"
                  right={0}
                  top="calc(100% + 4px)"
                  zIndex={1000}
                  bg="white"
                  borderRadius="8px"
                  boxShadow="0 4px 16px rgba(0,0,0,0.12)"
                  border="1px solid"
                  borderColor="gray.100"
                  minW="110px"
                  overflow="hidden"
                >
                  <Box
                    as="button"
                    w="full"
                    px={4}
                    py={3}
                    fontSize="13px"
                    textAlign="left"
                    color="gray.700"
                    _hover={{ bg: "gray.50" }}
                    onClick={handleReport}
                  >
                    신고하기
                  </Box>
                  <Box
                    as="button"
                    w="full"
                    px={4}
                    py={3}
                    fontSize="13px"
                    textAlign="left"
                    color="red.500"
                    borderTop="1px solid"
                    borderColor="gray.100"
                    _hover={{ bg: "red.50" }}
                    onClick={handleBlock}
                  >
                    차단하기
                  </Box>
                </Box>
              </>
            )}
          </Box>
        )}
        <Flex align="center" gap={2}>
          <Flex mt={0.5} align="center">
            <Box>
              <StarRating rating={total} size="lg" />
            </Box>
            <Box fontWeight={600} fontSize="16px" mb="-2px" ml={1.5} mr={1}>
              {total?.toFixed(1)}
            </Box>
          </Flex>
        </Flex>
      </Flex>

      {comment && (
        <Box mt={3} ml={1} fontSize="12px" color="gray.600">
          {comment}
        </Box>
      )}
      <Flex align="start" color="gray.500" mt={1} ml={0.5}>
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
            {power?.toFixed(1)}
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
