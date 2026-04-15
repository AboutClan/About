import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import SectionHeader from "../../components/atoms/SectionHeader";
import { ShortArrowIcon } from "../../components/Icons/ArrowIcons";
import StarRatingReviewBlock2 from "../../components/molecules/StarRatingReviewBlock2";
import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import ReviewForm from "../../components/organisms/StarRatingForm";
import { useToast, useTypeToast } from "../../hooks/custom/CustomToast";
import { useCheckGuest, useUserInfo } from "../../hooks/custom/UserHooks";
import {
  StudyPlaceProps,
  StudyRatingProps,
} from "../../types/models/studyTypes/study-entity.types";
import { getTodayStr } from "../../utils/dateTimeUtils";

interface StudyReviewProps {
  placeInfo: StudyPlaceProps;
  isArrived: boolean;
}

function StudyReviewSection({ placeInfo, isArrived }: StudyReviewProps) {
  const toast = useToast();
  const isGuest = useCheckGuest();
  const userInfo = useUserInfo();
  const typeToast = useTypeToast();
  const [isReviewDrawer, setIsReviewDrawer] = useState(false);

  const ratings = placeInfo?.ratings;

  const temp: StudyRatingProps = {
    comment: "여러분의 리뷰를 기다리고 있어요!",
    etc: 5,
    mood: 5,
    space: 5,
    table: 5,
    user: "",
    createdAt: getTodayStr(),
  };
  const reviewArr = [temp, ...ratings];

  return (
    <>
      <Box px={5} mt={5} mb={10}>
        <SectionHeader title="카공 장소 리뷰" subTitle="별점만 체크해도 200 Point 획득!">
          <Button variant="unstyled" onClick={() => typeToast(isGuest ? "guest" : "not-yet")}>
            <ShortArrowIcon dir="right" />
          </Button>
        </SectionHeader>
        <Flex flexDir="column" borderRadius="8px" mt={2}>
          {[...reviewArr]?.slice(0, 2).map((review, idx) => (
            <Box key={idx} pt={3} borderTop="var(--border)">
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
              if (ratings?.some((r) => r.user === userInfo?._id)) {
                toast("info", "이미 리뷰를 완료한 스터디 장소예요!");
                return;
              }
              setIsReviewDrawer(true);
            }}
          >
            장소 별점 체크하기
          </Button>
        </Flex>{" "}
      </Box>
      {isReviewDrawer && (
        <RightReviewDrawer placeId={placeInfo._id} onClose={() => setIsReviewDrawer(false)} />
      )}
    </>
  );
}

export default StudyReviewSection;

function RightReviewDrawer({ placeId, onClose }: { placeId: string; onClose: () => void }) {
  return (
    <RightDrawer title="카페 후기" onClose={onClose}>
      <ReviewForm placeId={placeId} onClose={onClose} />
    </RightDrawer>
  );
}
