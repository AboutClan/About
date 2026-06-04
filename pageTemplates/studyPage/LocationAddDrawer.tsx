import { Box, Button, Flex, FormControl } from "@chakra-ui/react";
import { useState } from "react";

import { Input } from "../../components/atoms/Input";
import Textarea from "../../components/atoms/Textarea";
import { StarIcon } from "../../components/Icons/StarIcon";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../components/organisms/SearchLocation";
import { useToast } from "../../hooks/custom/CustomToast";
import { useStudyAdditionMutation } from "../../hooks/study/mutations";
import { LocationProps } from "../../types/common";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import RegisterOverview from "../register/RegisterOverview";

interface LocationAddDrawerProps {
  placeArr?: StudyPlaceProps[];
  onClose: () => void;
  prefilledLocation?: LocationProps;
}

interface ReviewState {
  mood: number;
  power: number;
  space: number;
  etc: number;
  comment: string;
}

function StarBlock({ rating, setRating }: { rating: number; setRating: (v: number) => void }) {
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

export function LocationAddDrawer({
  onClose,
  placeArr,
  prefilledLocation,
}: LocationAddDrawerProps) {
  const toast = useToast();

  const [page, setPage] = useState(1);

  const [placeInfo, setPlaceInfo] = useState<LocationProps>(
    prefilledLocation ?? { name: "", address: "", latitude: null, longitude: null },
  );
  const [review, setReview] = useState<ReviewState>({
    mood: 3,
    power: 3,
    space: 3,
    etc: 3,
    comment: "",
  });
  const [nickname, setNickname] = useState("");

  const { mutate, isLoading } = useStudyAdditionMutation({
    onSuccess() {
      toast(
        "success",
        "요청이 완료되었습니다. AI가 해당 카페를 분석한 뒤, 5분 이내 별점을 산정해 자동 등록합니다.",
      );
      onClose();
    },
  });

  const onClickNext = () => {
    if (page === 1) {
      if ([placeInfo?.name, placeInfo?.address].some((field) => !field)) {
        toast("warning", "장소를 입력해주세요.");
        return;
      }
      if (placeArr?.some((p) => p.location.name === placeInfo.name)) {
        toast("info", "이미 등록된 장소입니다.");
        return;
      }
      setPage(2);
    } else if (page === 2) {
      setPage(3);
    } else {
      if (nickname.length < 1 || nickname.length > 5) {
        toast("info", "글자 수를 확인해 주세요!");
        return;
      }
      const { latitude, longitude, address, name } = placeInfo;
      const status = (placeInfo as any)?.category?.includes("카페") ? "sub" : "inactive";

      console.log(52, nickname);

      mutate({
        location: { name, latitude, longitude, address },
        status,
        name: nickname,
        review: { ...review, name: nickname },
      } as any);
    }
  };

  const handleBack = () => {
    if (page === 1) onClose();
    else setPage((p) => p - 1);
  };

  return (
    <RightDrawer title="장소 추가" onClose={handleBack} px={false}>
      <Box
        display="flex"
        flexDir="column"
        height="calc(100dvh - var(--header-h))"
        overflow="hidden"
      >
        <Box flex={1} px={5} pb={1} overflowY="auto">
          {/* 1페이지: 장소 검색 */}
          {page === 1 && (
            <>
              <RegisterOverview>
                <span>등록하고 싶은 카페를 입력해 주세요</span>
                <span>
                  AI가 실제 카공 후기를 찾아 분석한 뒤, 카페의 특징과 카공 별점을 산정해 5분 이내
                  자동 등록합니다.
                </span>
              </RegisterOverview>
              <SearchLocation
                placeHolder="ex) 사당역 투썸플레이스"
                placeInfo={placeInfo}
                setPlaceInfo={setPlaceInfo}
              />
            </>
          )}

          {/* 2페이지: 별점 입력 */}
          {page === 2 && (
            <>
              <Flex flexDir="column" lineHeight={1.8} mt={2} mb={6}>
                <Box fontSize="24px" fontWeight={600} lineHeight="36px" color="gray.800" mb={2}>
                  카페는 공부하기에 어떤가요?
                </Box>
                <Box fontSize="13px" lineHeight="20px" color="gray.600">
                  카공러 입장에서의 솔직한 리뷰를 남겨주세요!
                </Box>
              </Flex>

              <Flex flexDir="column" mb={5}>
                <Box color="gray.600" fontSize="13px" fontWeight={600}>
                  공부하기 좋은 분위기인가요?
                </Box>
                <StarBlock
                  rating={review.mood}
                  setRating={(v) => setReview((r) => ({ ...r, mood: v }))}
                />
              </Flex>
              <Flex flexDir="column" mb={5}>
                <Box color="gray.600" fontSize="13px" fontWeight={600}>
                  콘센트는 충분한가요?
                </Box>
                <StarBlock
                  rating={review.power}
                  setRating={(v) => setReview((r) => ({ ...r, power: v }))}
                />
              </Flex>
              <Flex flexDir="column" mb={5}>
                <Box color="gray.600" fontSize="13px" fontWeight={600}>
                  자리는 여유로운가요?
                </Box>
                <StarBlock
                  rating={review.space}
                  setRating={(v) => setReview((r) => ({ ...r, space: v }))}
                />
              </Flex>
              <Flex flexDir="column" mb={5}>
                <Box color="gray.600" fontSize="13px" fontWeight={600}>
                  기타 만족도
                </Box>
                <StarBlock
                  rating={review.etc}
                  setRating={(v) => setReview((r) => ({ ...r, etc: v }))}
                />
              </Flex>

              <FormControl mt={2} mb={3}>
                <Textarea
                  placeholder="(선택) 카페 후기를 작성할 수 있습니다."
                  fontSize="12px"
                  resize="vertical"
                  minH="100px"
                  value={review.comment}
                  onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))}
                  color="gray.700"
                />
              </FormControl>
            </>
          )}

          {/* 3페이지: 닉네임 입력 */}
          {page === 3 && (
            <>
              <RegisterOverview>
                <span>등록할 닉네임을 입력해 주세요</span>
                <span>작성한 닉네임은 카페 소개 상단에 배지로 추가됩니다.</span>
              </RegisterOverview>
              <Input
                placeholder="다섯 글자 이내로 입력해 주세요."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={5}
              />
            </>
          )}
        </Box>

        <Box px={5} pt={3} pb={getSafeAreaBottom(8)}>
          <Button
            w="full"
            size="lg"
            borderRadius="12px"
            backgroundColor="var(--color-mint)"
            color="white"
            fontSize="14px"
            isLoading={isLoading}
            fontWeight={700}
            onClick={onClickNext}
            _focus={{ backgroundColor: "var(--color-mint)", color: "white" }}
          >
            {page === 3 ? "완 료" : "다 음"}
          </Button>
        </Box>
      </Box>
    </RightDrawer>
  );
}
