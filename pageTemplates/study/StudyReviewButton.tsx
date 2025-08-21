import { Button, Flex } from "@chakra-ui/react";
import { iPhoneNotchSize } from "../../utils/validationUtils";

interface StudyReviewButtonProps {}

function StudyReviewButton({}: StudyReviewButtonProps) {
  const [isReviewModal, setIsReviewModal] = useState(false);
  return (
    <>
      <Flex
        position="fixed"
        zIndex="800"
        fontSize="12px"
        lineHeight="24px"
        fontWeight={700}
        bottom={`calc(var(--bottom-nav-height) + ${iPhoneNotchSize() + 20}px)`}
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
          rightIcon={<PencilIcon />}
          // isDisabled={
          //   !(
          //     myStudy?.attendance?.type === "arrived" &&
          //     !findMyStudy?.place?.reviews.some(
          //       (review) => review?.user?._id === session?.user.id,
          //     )
          //   )
          // }
          onClick={() => setIsReviewModal(true)}
          _hover={{
            background: undefined,
          }}
        >
          {/* {findMyStudy?.place?.reviews.some(
                  (review) => review?.user?._id === session?.user.id,
                )
                  ? "작성 완료"
                  : "카페 리뷰"} */}
        </Button>
      </Flex>
      {isReviewModal && (
        <RightReviewDrawer placeId={placeInfo._id} onClose={() => setIsReviewModal(false)} />
      )}
    </>
  );
}

export default StudyReviewButton;

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
