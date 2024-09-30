import { Box, Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import StudyAttendCheckModal from "../../modals/study/StudyAttendCheckModal";

interface RealStudyBottomNavProps {
  refetchCurrentLocation: () => void;
}

function RealStudyBottomNav({ refetchCurrentLocation }: RealStudyBottomNavProps) {
  const searchParams = useSearchParams();
  const [isAttendModal, setIsAttendModal] = useState(false);

  return (
    <>
      <Box position="absolute" bottom="0" w="100%">
        <Button
          ml={4}
          rounded="full"
          aspectRatio={1 / 1}
          bgColor="white"
          boxShadow="0 4px 8px rgba(0,0,0,0.1)"
          onClick={refetchCurrentLocation}
        >
          <i className="fa-regular fa-location-crosshairs" />
        </Button>
        <Flex p={4}>
          <Button
            as="div"
            flex={1}
            mr={3}
            size="lg"
            h="50px"
            bgColor="white"
            boxShadow="0 4px 8px rgba(0,0,0,0.1)"
          >
            <Link href={`/vote/participate?${searchParams.toString()}`}>스터디 예약</Link>
          </Button>
          <Button
            flex={1}
            size="lg"
            h="50px"
            colorScheme="mintTheme"
            boxShadow="0 4px 8px rgba(0,0,0,0.1)"
            onClick={() => setIsAttendModal(true)}
          >
            실시간 출석체크
          </Button>
        </Flex>
      </Box>
      {isAttendModal && <StudyAttendCheckModal setIsModal={setIsAttendModal} />}
    </>
  );
}

export default RealStudyBottomNav;
