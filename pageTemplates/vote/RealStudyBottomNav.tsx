import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import BottomNavWrapper from "../../components/atoms/BottomNavWrapper";
import NewTwoButtonRow from "../../components/molecules/NewTwoButtonRow";
import StudyAttendCheckModal from "../../modals/study/StudyAttendCheckModal";

interface RealStudyBottomNavProps {
  isAleadyAttend: boolean;
}

function RealStudyBottomNav({ isAleadyAttend }: RealStudyBottomNavProps) {
  const searchParams = useSearchParams();
  const [isAttendModal, setIsAttendModal] = useState(false);

  return (
    <BottomNavWrapper>
      <NewTwoButtonRow
        leftProps={{
          icon: <i className="fa-solid fa-clock" style={{ color: "var(--gray-400)" }} />,
          children: <Link href={`/vote/participate?${searchParams.toString()}`}>스터디 예약</Link>,
        }}
        rightProps={{
          icon: <i className="fa-solid fa-badge-check" style={{ color: "#CCF3F0" }} />,
          children: !isAleadyAttend ? (
            <Link href={`/vote/attend/certification`}>실시간 출석체크</Link>
          ) : (
            <Box>스터디 출석 완료</Box>
          ),
          isDisabled: isAleadyAttend,
        }}
      />
      {/* <Flex>
        <NewButton
          as="div"
          flex={1}
          fontWeight={700}
          mr={3}
          size="sm"
          h="48px"
          bgColor="white"
          borderRadius="12px"
          boxShadow=" 0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
          leftIcon={<i className="fa-solid fa-clock" style={{ color: "var(--gray-400)" }} />}
        >
          <Link href={`/vote/participate?${searchParams.toString()}`}>스터디 예약</Link>
        </NewButton>
        <NewButton
          as="div"
          flex={1}
          fontWeight={700}
          mr={3}
          size="sm"
          h="48px"
          colorScheme="mintTheme"
          borderRadius="12px"
          boxShadow=" 0px 5px 10px 0px rgba(66, 66, 66, 0.1)"
          leftIcon={<i className="fa-solid fa-badge-check" style={{ color: "#CCF3F0" }} />}
        >
          실시간 출석체크
        </NewButton>
      </Flex> */}
      {isAttendModal && <StudyAttendCheckModal setIsModal={setIsAttendModal} />}
    </BottomNavWrapper>
  );
}

export default RealStudyBottomNav;
