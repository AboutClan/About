import { Box, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { CheckCircleIcon } from "../../components/Icons/CircleIcons";
import { CalendarCheckIcon, ClockIcon } from "../../components/Icons/SolidIcons";
import { IBottomDrawerLgOptions } from "../../components/organisms/drawer/BottomDrawerLg";
import BottomFlexDrawer, {
  DRAWER_MIN_HEIGHT,
} from "../../components/organisms/drawer/BottomFlexDrawer";
import { myStudyParticipationState } from "../../recoils/studyRecoils";
import { IMarkerOptions } from "../../types/externals/naverMapTypes";
import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import { StudyDailyInfoProps } from "../../types/models/studyTypes/studyDetails";
import { MyVoteProps } from "../../types/models/studyTypes/studyInterActions";
import { ActiveLocation } from "../../types/services/locationTypes";
import { iPhoneNotchSize } from "../../utils/validationUtils";
import VoteDrawer from "./VoteDrawer";

interface StudyControlButtonProps {
  isAleadyAttend: boolean;
  location: ActiveLocation;
  studyVoteData: StudyDailyInfoProps;
  setMarkersOptions: DispatchType<IMarkerOptions[]>;
  setResizeToggle: DispatchBoolean;
  setIsLocationRefetch: DispatchBoolean;
  setCenterLocation: DispatchType<{ lat: number; lon: number }>;
  setMapOptions: () => void;
  date: string;
  myVote: MyVoteProps;
  setMyVote: DispatchType<MyVoteProps>;
}

function StudyControlButton({
  location,
  studyVoteData,
  setMarkersOptions,
  isAleadyAttend,
  setMapOptions,
  setCenterLocation,
  setIsLocationRefetch,
  setResizeToggle,
  date,
  myVote,
  setMyVote,
}: StudyControlButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const newSearchParams = new URLSearchParams(searchParams);

  const [isStudyDrawer, setIsStudyDrawer] = useState(false);
  const [isVoteDrawer, setIsVoteDrawer] = useState(false);

  const myStudyParticipation = useRecoilValue(myStudyParticipationState);

  const isOpenStudy = myStudyParticipation?.status === "open";

  useEffect(() => {
    if (isVoteDrawer) {
      setMapOptions();
      setResizeToggle(true);
      setIsStudyDrawer(true);

      newSearchParams.set("category", "voting");
      router.replace(`/studyPage?${newSearchParams.toString()}`);
    } else if (categoryParam === "voting") {
      setResizeToggle(false);
      setIsLocationRefetch(true);
      newSearchParams.set("category", "currentplace");
      router.replace(`/studyPage?${newSearchParams.toString()}`);
    }
  }, [isVoteDrawer]);

  const options: IBottomDrawerLgOptions = {
    footer: {
      buttonText: "취소",
      onClick: () => setIsStudyDrawer(false),
    },
  };

  const handleStudyDrawerDown = () => {
   
    setIsVoteDrawer(false);
    setIsStudyDrawer(false);
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
        rightIcon={<CheckCircleIcon size="sm" isFill={false} />}
        onClick={() => setIsStudyDrawer(true)}
      >
        스터디
      </Button>
      {isStudyDrawer && (
        <BottomFlexDrawer
          isDrawerUp
          setIsModal={handleStudyDrawerDown}
          isHideBottom
          bottom={{ text: "취소", func: () => handleStudyDrawerDown() }}
          height={197}
          zIndex={800}
        >
          <Button
            h="52px"
            justifyContent="flex-start"
            display="flex"
            variant="unstyled"
            py={4}
            w="100%"
            onClick={() => setIsVoteDrawer(true)}
          >
            <Box w="20px" h="20px" mr={4} opacity={0.28}>
              <ClockIcon />
            </Box>
            <Box fontSize="13px" color="var(--gray-600)">
              스터디 예약
            </Box>
          </Button>

          <Link
            href={
              isOpenStudy
                ? `/vote/attend/configuration?${searchParams.toString()}`
                : `/vote/attend/certification?${searchParams.toString()}`
            }
            style={{ width: "100%" }}
          >
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
          </Link>
        </BottomFlexDrawer>
      )}
      {isVoteDrawer && (
        <VoteDrawer
          date={date}
          location={location}
          setIsModal={handleStudyDrawerDown}
          studyVoteData={studyVoteData}
          setMarkersOptions={setMarkersOptions}
          setCenterLocation={setCenterLocation}
          myVote={myVote}
          setMyVote={setMyVote}
        />
      )}
    </>
  );
}

export default StudyControlButton;
