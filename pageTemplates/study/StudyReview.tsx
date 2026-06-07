import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import StarRatingReviewBlock2 from "../../components/molecules/StarRatingReviewBlock2";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import ReviewForm from "../../components/organisms/StarRatingForm";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useCheckGuest } from "../../hooks/custom/UserHooks";
import { StudyPlaceProps } from "../../types/models/studyTypes/study-entity.types";

interface StudyReviewProps {
  placeInfo: StudyPlaceProps;
  isArrived: boolean;
}

function StudyReviewSection({ placeInfo, isArrived }: StudyReviewProps) {
  const toast = useToast();
  const isGuest = useCheckGuest();
  const typeToast = useTypeToast();
  const [isReviewDrawer, setIsReviewDrawer] = useState(false);

  const ratings = placeInfo?.ratings || [];

  const getNaturalRatings = (rating: number, seed: number) => {
    const candidates = [
      [0, 0, 0, 0],
      [0.5, 0, 0, -0.5],
      [0.5, 0.5, -0.5, -0.5],
      [1, 0, -0.5, -0.5],
      [0.5, 0, 0, -0.5],
    ];
    const offsets = candidates[seed % candidates.length];
    return {
      mood: Math.min(5, Math.max(0, rating + offsets[0])),
      power: Math.min(5, Math.max(0, rating + offsets[1])),
      space: Math.min(5, Math.max(0, rating + offsets[2])),
      etc: Math.min(5, Math.max(0, rating + offsets[3])),
    };
  };

  const seed = Number(placeInfo?.location?.latitude?.toString().slice(-1));
  const naturalRatings = getNaturalRatings(4.5, seed || 0);
  const naturalRatings2 = getNaturalRatings(4, seed || 0);
  const reviewArr = ratings?.length ? ratings : [naturalRatings, naturalRatings2];

  return (
    <>
      <Box px={5} mt={5} mb={5}>
        <SectionHeader title="카공 장소 리뷰" subTitle="별점만 체크해도 200 Point 획득!">
          <Button variant="unstyled" onClick={() => typeToast(isGuest ? "guest" : "not-yet")}>
            <ShortArrowIcon dir="right" />
          </Button>
        </SectionHeader>
        <Flex flexDir="column" borderRadius="8px" mt={2}>
          {[...reviewArr].slice(0, 2).map((review, idx) => (
            <Box
              key={idx}
              py={3}
              borderBottom={idx !== Math.min(reviewArr.length, 2) - 1 ? "var(--border)" : "none"}
            >
              <StarRatingReviewBlock2 review={review} idx={idx + 1} />
            </Box>
          ))}

          <Button
            mt={2}
            borderRadius={8}
            color="mint"
            border="1px solid var(--color-mint)"
            bg="white"
            w="full"
            onClick={() => {
              if (isGuest) {
                typeToast("guest");
                return;
              }
              if (!isArrived) {
                toast("info", "스터디 출석 후에 체크할 수 있어요!");
                return;
              }
              // if (ratings?.some((r) => r.user === userInfo?._id)) {
              //   toast("info", "이미 리뷰를 완료한 스터디 장소예요!");
              //   return;
              // }
              setIsReviewDrawer(true);
            }}
          >
            카공 장소 별점 남기기
          </Button>
        </Flex>{" "}
      </Box>
      {isReviewDrawer && (
        <RightReviewDrawer
          placeId={placeInfo._id}
          onClose={() => setIsReviewDrawer(false)}
          zIndex={4000}
        />
      )}
    </>
  );
}

export default StudyReviewSection;

export function RightReviewDrawer({
  placeId,
  onClose,
  zIndex,
}: {
  zIndex: number;
  placeId: string;
  onClose: () => void;
}) {
  return (
    <RightDrawer title="카페 후기" onClose={onClose} zIndex={zIndex}>
      <ReviewForm placeId={placeId} onClose={onClose} />
    </RightDrawer>
  );
}
