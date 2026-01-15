import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import InfoList from "../../components/atoms/lists/InfoList";
import { useToast } from "../../hooks/custom/CustomToast";
import { ModalLayout } from "../../modals/Modals";
import { StudyConfirmedMemberProps } from "../../types/models/studyTypes/study-entity.types";
import { iPhoneNotchSize } from "../../utils/validationUtils";
interface StudyReviewButtonProps {
  placeId: string;

  myStudyInfo: StudyConfirmedMemberProps;
}

function StudyReviewButton({ placeId, myStudyInfo }: StudyReviewButtonProps) {
  const toast = useToast();
  const [isReviewModal, setIsReviewModal] = useState(false);
  console.log(placeId);
  const isAttend = myStudyInfo?.attendance?.type === "arrived";

  const handleModalOpen = () => {
    if (!isAttend) {
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
          isAttend
            ? `${iPhoneNotchSize() + 72}px`
            : `calc(var(--bottom-nav-height) + ${iPhoneNotchSize() + 72}px)`
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="12px"
                viewBox="0 -960 960 960"
                width="12px"
                fill="white"
              >
                <path d="M520-278q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 97q-14 0-26.5-3.5T430-194q-39-23-82-34.5T260-240q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q47-23 96.5-35.5T260-800q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 101.5 12.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-45 0-88 11.5T530-194q-11 6-23.5 9.5T480-181Zm80-428q0-9 6.5-18.5T581-640q29-10 58-15t61-5q20 0 39.5 2.5T778-651q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-600q-26 0-51 5t-48 13q-18 7-29.5-1T560-609Zm0 220q0-9 6.5-18.5T581-420q29-10 58-15t61-5q20 0 39.5 2.5T778-431q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-380q-26 0-51 4.5T601-363q-18 7-29.5-.5T560-389Zm0-110q0-9 6.5-18.5T581-530q29-10 58-15t61-5q20 0 39.5 2.5T778-541q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-490q-26 0-51 5t-48 13q-18 7-29.5-1T560-499Z" />
              </svg>
            </Box>
          }
          onClick={handleModalOpen}
          _hover={{
            background: undefined,
          }}
        >
          출석 이후 가이드
        </Button>
      </Flex>
      {isReviewModal && (
        <ModalLayout title="출석 이후 가이드" setIsModal={setIsReviewModal} footerOptions={{}}>
          <Box mb={3}>스터디 출석 후 난감해 하고 있는 당신을 위해 ...!</Box>
          <InfoList
            items={[
              "다른 사람의 출석 정보를 먼저 확인해요.",
              "먼저 온 멤버를 찾아 가볍게 인사해 주세요!",
              "못 찾겠다면, 스터디 톡방에 물어보면 됩니다.",
              "같이 공부해도 되고, 혼자 공부해도 돼요!",
              "식사 의향이 있다면, 같이 먹을지 물어봐요.",
              "스터디를 마칠 때도 가볍게 인사해 주세요!",
              "장소를 변경한다면, 톡방에도 알려주세요.",
            ]}
          />
        </ModalLayout>
      )}
    </>
  );
}

export default StudyReviewButton;

// function RightReviewDrawer({ placeId, onClose }: { placeId: string; onClose: () => void }) {
//   const resetStudy = useResetStudyQuery();
//   const pointToast = usePointToast();
//   const { data: userInfo } = useUserInfoQuery();

//   const { mutate: updatePoint } = usePointSystemMutation("point");
//   const { mutate } = usePlaceReviewMutation({
//     onSuccess() {
//       resetStudy();
//       onClose();
//     },
//   });

//   const handleSubmit = (data: PlaceReviewProps) => {
//     mutate({ ...data, placeId });
//     updatePoint({ value: data.isSecret ? 30 : 100, message: "카페 후기 작성", sub: "study" });
//     pointToast(data.isSecret ? 30 : 100);
//   };

//   return (
//     <RightDrawer title="카페 후기" onClose={onClose}>
//       <Box mt={5}>
//         <StarRatingForm user={userInfo} onSubmit={handleSubmit} />
//       </Box>
//     </RightDrawer>
//   );
// }

// function PencilIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       height="12px"
//       viewBox="0 -960 960 960"
//       width="12px"
//       fill="white"
//     >
//       <path d="M168-121q-21 5-36.5-10.5T121-168l35-170 182 182-170 35Zm235-84L205-403l413-413q23-23 57-23t57 23l84 84q23 23 23 57t-23 57L403-205Z" />
//     </svg>
//   );
// }
