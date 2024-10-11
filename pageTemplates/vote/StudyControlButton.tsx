import { Box, Button } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import { CalendarCheckIcon, ClockIcon } from "../../components/Icons/SolidIcons";
import BottomDrawerLg, {
  IBottomDrawerLgOptions,
} from "../../components/organisms/drawer/BottomDrawerLg";
import { DRAWER_MIN_HEIGHT } from "../../components/organisms/drawer/BottomFlexDrawer";

import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { iPhoneNotchSize } from "../../utils/validationUtils";

interface StudyControlButtonProps {
  isAleadyAttend: boolean;
}

function StudyControlButton({ isAleadyAttend }: StudyControlButtonProps) {
  const searchParams = useSearchParams();
  const [isAttendModal, setIsAttendModal] = useState(false);

  const [isStudyDrawer, setIsStudyDrawer] = useState(false);

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);

  const isOpenStudy = myStudyParticipation?.status === "open";

  const options: IBottomDrawerLgOptions = {
    footer: {
      buttonText: "취소",
      onClick: () => {},
    },
  };

  return (
    <>
      <Button
        w="76px"
        fontSize="12px"
        h="40px"
        bgColor="black"
        fontWeight={700}
        color="white"
        position="fixed"
        borderRadius="20px"
        lineHeight="24px"
        bottom={`calc(var(--bottom-nav-height) + ${DRAWER_MIN_HEIGHT + iPhoneNotchSize() + 12}px)`}
        right="20px"
        iconSpacing={1}
        rightIcon={<CheckCircleIcon />}
      >
        스터디
      </Button>
      {
        <BottomDrawerLg setIsModal={setIsStudyDrawer} options={options} height={197}>
          <Button
            h="52px"
            justifyContent="flex-start"
            display="flex"
            variant="unstyled"
            py={4}
            w="100%"
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              <ClockIcon />
            </Box>
            <Box fontSize="13px" color="var(--gray-600)">
              스터디 예약
            </Box>
          </Button>

          <Button
            h="52px"
            display="flex"
            justifyContent="flex-start"
            variant="unstyled"
            py={4}
            w="100%"
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              <CalendarCheckIcon />
            </Box>
            <Box fontSize="13px" color="var(--gray-600)">
              실시간 출석체크
            </Box>
          </Button>
        </BottomDrawerLg>
      }
    </>
    // <BottomNavWrapper>
    //   <NewTwoButtonRow
    //     leftProps={{
    //       icon: <i className="fa-solid fa-clock" style={{ color: "var(--gray-400)" }} />,
    //       children: <Link href={`/vote/participate?${searchParams.toString()}`}>스터디 예약</Link>,
    //     }}
    //     rightProps={{
    //       icon: <i className="fa-solid fa-badge-check" style={{ color: "#CCF3F0" }} />,
    //       children: !isAleadyAttend ? (
    //         <Link
    //           href={
    //             isOpenStudy
    //               ? `/vote/attend/configuration?${searchParams.toString()}`
    //               : `/vote/attend/certification?${searchParams.toString()}`
    //           }
    //         >
    //           실시간 출석체크
    //         </Link>
    //       ) : (
    //         <Box>스터디 출석 완료</Box>
    //       ),
    //       isDisabled: isAleadyAttend,
    //     }}
    //   />
    //   {/* <Flex>
    //     <NewButton
    //       as="div"
    //       flex={1}
    //       fontWeight={700}
    //       mr={3}
    //       size="sm"
    //       h="48px"
    //       bgColor="white"
    //       borderRadius="12px"
    //       boxShadow=" 0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
    //       leftIcon={<i className="fa-solid fa-clock" style={{ color: "var(--gray-400)" }} />}
    //     >
    //       <Link href={`/vote/participate?${searchParams.toString()}`}>스터디 예약</Link>
    //     </NewButton>
    //     <NewButton
    //       as="div"
    //       flex={1}
    //       fontWeight={700}
    //       mr={3}
    //       size="sm"
    //       h="48px"
    //       colorScheme="mintTheme"
    //       borderRadius="12px"
    //       boxShadow=" 0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
    //       leftIcon={<i className="fa-solid fa-badge-check" style={{ color: "#CCF3F0" }} />}
    //     >
    //       실시간 출석체크
    //     </NewButton>
    //   </Flex> */}
    //   {isAttendModal && <StudyAttendCheckModal setIsModal={setIsAttendModal} />}
    // </BottomNavWrapper>
  );
}

export default StudyControlButton;
