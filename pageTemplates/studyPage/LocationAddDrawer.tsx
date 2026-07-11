import { Box, Button, Flex, FormControl } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { Input } from "../../components/atoms/Input";
import Textarea from "../../components/atoms/Textarea";
import { StarIcon } from "../../components/Icons/StarIcon";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import SearchLocation from "../../components/organisms/SearchLocation";
import { usePointToast, useToast } from "../../hooks/custom/CustomToast";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { useStudyAdditionMutation } from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { ModalLayout } from "../../modals/Modals";
import { LocationProps } from "../../types/common";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";
import { getDistanceFromLatLonInKm } from "../../utils/mathUtils";
import { getSafeAreaBottom } from "../../utils/validationUtils";
import RegisterOverview from "../register/RegisterOverview";

interface LocationAddDrawerProps {
  placeArr?: StudyPlaceProps[];
  onClose: () => void;
  prefilledLocation?: LocationProps;
  // 검색한 장소가 이미 등록되어 있을 때, 신규 등록 대신 그 장소의 리뷰 작성 폼으로 이어준다.
  onExistingPlace?: (place: StudyPlaceProps) => void;
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
  onExistingPlace,
}: LocationAddDrawerProps) {
  const toast = useToast();
  const pointToast = usePointToast();
  const { mutate: updatePoint } = usePointSystemMutation("point");
  const router = useRouter();
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
  const [isNicknameModal, setIsNicknameModal] = useState(false);

  const [nickname, setNickname] = useState("");
  const userInfo = useUserInfo();

  const { mutate, isLoading } = useStudyAdditionMutation({
    onSuccess() {
      toast(
        "success",
        "요청이 완료되었습니다. AI가 해당 카페를 분석한 뒤, 5분 이내 별점을 산정해 자동 등록합니다.",
      );
      if (userInfo?.role !== "guest") {
        updatePoint({ value: 100, message: "카공 장소 등록 + 리뷰 작성", sub: "study" });
        pointToast(100);
      }
      onClose();
    },
  });

  const onClickNext = () => {
    if (page === 1) {
      if ([placeInfo?.name, placeInfo?.address].some((field) => !field)) {
        toast("warning", "장소를 입력해주세요.");
        return;
      }
      const existingPlace = placeArr?.find((p) => {
        if (p.location.name === placeInfo.name) return true;
        const dist = getDistanceFromLatLonInKm(
          placeInfo.latitude,
          placeInfo.longitude,
          p.location.latitude,
          p.location.longitude,
        );
        return dist < 0.1;
      });
      if (existingPlace) {
        // onClose()(router.back())를 호출하면 onExistingPlace 가 이동시킨 라우터 상태를
        // 되돌려버리므로 호출하지 않는다. addCafe 드로어는 모달 쿼리가 바뀌면서 자동으로 닫힌다.
        onExistingPlace?.(existingPlace);
        return;
      }
      setPage(2);
    } else {
      if (userInfo?.role === "guest") {
        setIsNicknameModal(true);
        return;
      }
      const { latitude, longitude, address, name } = placeInfo;
      const status = (placeInfo as any)?.category?.includes("카페") ? "sub" : "inactive";

      mutate({
        location: { name, latitude, longitude, address },
        status,
        name: nickname,
        review: { ...review, name: nickname },
      } as any);
    }
  };

  const handleSubmit = () => {
    const { latitude, longitude, address, name } = placeInfo;
    const status = (placeInfo as any)?.category?.includes("카페") ? "sub" : "inactive";

    mutate({
      location: { name, latitude, longitude, address },
      status,
      name: "익명",
      review: { ...review, name: "익명" },
    } as any);
  };

  const handleBack = () => {
    if (page === 1) onClose();
    else setPage((p) => p - 1);
  };

  return (
    <>
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
                  <span>리뷰하고 싶은 카페는 어디인가요?</span>
                  <span>
                    카공지도에 등록된 카페인지 먼저 확인할게요! AI가 해당 카페의 실제 후기를 찾아
                    분석합니다.
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
              {page === 2 ? "완 료" : "다 음"}
            </Button>
          </Box>
        </Box>
      </RightDrawer>
      {isNicknameModal && (
        <ModalLayout
          title="등록을 완료할까요?"
          setIsModal={setIsNicknameModal}
          footerOptions={{
            main: { text: "게스트로 등록하기", func: () => handleSubmit(), isLoading },
            sub: {
              text: "카공지도 가입하기",
              func: () => {
                router.push(`/cafe-map/login`);
              },
            },
          }}
        >
          <Box>
            게스트로 이용 중이라 리워드가 지급되지 않아요.
            <br />
            카공지도 멤버는 활동할 때마다 <b>리워드 지급!</b>
          </Box>
        </ModalLayout>
      )}
    </>
  );
}
