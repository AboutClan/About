import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import RightDrawer from "../../components/organisms/drawer/RightDrawer";
import StarRatingForm from "../../components/organisms/StarRatingForm";
import { useResetStudyQuery } from "../../hooks/custom/CustomHooks";
import { usePointToast, useToast } from "../../hooks/custom/CustomToast";
import { usePlaceReviewMutation } from "../../hooks/study/mutations";
import { usePointSystemMutation } from "../../hooks/user/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { PlaceReviewProps } from "../../types/models/studyTypes/entityTypes";
import { StudyConfirmedMemberProps } from "../../types/models/studyTypes/study-entity.types";
import { iPhoneNotchSize } from "../../utils/validationUtils";
interface StudyReviewButtonProps {
  placeId: string;

  myStudyInfo: StudyConfirmedMemberProps;
}

function StudyReviewButton({ placeId, myStudyInfo }: StudyReviewButtonProps) {
  const toast = useToast();
  const [isReviewModal, setIsReviewModal] = useState(false);

  const handleModalOpen = () => {
    if (myStudyInfo?.attendance?.type !== "arrived") {
      toast("info", "스터디 출석 완료 후 작성하실 수 있어요!");
      return;
    }
    setIsReviewModal(true);
  };

  return (
    <>
      <Flex
        position="fixed"
        zIndex="100"
        fontSize="12px"
        lineHeight="24px"
        fontWeight={700}
        bottom={
          myStudyInfo?.attendance?.type === "arrived"
            ? `${iPhoneNotchSize() + 20}px`
            : `calc(var(--bottom-nav-height) + ${iPhoneNotchSize() + 20}px)`
        }
        right="20px"
      >
        <Button
          fontSize="12px"
          h="40px"
          color="white"
          px={4}
          borderRadius="20px"
          lineHeight="24px"
          iconSpacing={1}
          colorScheme="black"
          rightIcon={
            <Box mb="1px">
              <PencilIcon />
            </Box>
          }
          // isDisabled={
          //   !(
          //     myStudy?.attendance?.type === "arrived" &&
          //     !findMyStudy?.place?.reviews.some(
          //       (review) => review?.user?._id === session?.user.id,
          //     )
          //   )
          // }
          onClick={handleModalOpen}
          _hover={{
            background: undefined,
          }}
        >
          카페 리뷰
        </Button>
      </Flex>
      {isReviewModal && (
        <RightReviewDrawer placeId={placeId} onClose={() => setIsReviewModal(false)} />
      )}
    </>
  );
}

export default StudyReviewButton;
function RightReviewDrawer({ placeId, onClose }: { placeId: string; onClose: () => void }) {
  const resetStudy = useResetStudyQuery();
  const pointToast = usePointToast();
  const { data: userInfo } = useUserInfoQuery();

  const { mutate: updatePoint } = usePointSystemMutation("point");
  const { mutate } = usePlaceReviewMutation({
    onSuccess() {
      resetStudy();
      onClose();
    },
  });

  const handleSubmit = (data: PlaceReviewProps) => {
    mutate({ ...data, placeId });
    updatePoint({ value: data.isSecret ? 30 : 100, message: "카페 후기 작성", sub: "study" });
    pointToast(data.isSecret ? 30 : 100);
  };

  return (
    <RightDrawer title="카페 후기" onClose={onClose}>
      <Box mt={5}>
        <StarRatingForm user={userInfo} onSubmit={handleSubmit} />
      </Box>
    </RightDrawer>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="12px"
      viewBox="0 -960 960 960"
      width="12px"
      fill="white"
    >
      <path d="M168-121q-21 5-36.5-10.5T121-168l35-170 182 182-170 35Zm235-84L205-403l413-413q23-23 57-23t57 23l84 84q23 23 23 57t-23 57L403-205Z" />
    </svg>
  );
}
