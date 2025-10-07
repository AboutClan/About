import { Badge, Box, Button } from "@chakra-ui/react";
import { useState } from "react";

import { IProfileCommentCard } from "../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../components/organisms/ProfileCardColumn";
import { useUserInfo } from "../../hooks/custom/UserHooks";
import { StudyParticipationProps } from "../../types/models/studyTypes/study-entity.types";
import { getPlaceBranch } from "../../utils/stringUtils";

type Center = { latitude: number; longitude: number };

export function filterByLatLonEps(
  members: StudyParticipationProps[],
  center: Center,
  epsLatDeg: number,
  epsLonDeg: number = epsLatDeg,
) {
  if (!members?.length || !center) return;
  const toNum = (v: number | string) => (typeof v === "number" ? v : parseFloat(v));
  const { latitude: cLat, longitude: cLon } = center;

  return members.filter((p) => {
    const lat = toNum(p.location.latitude);
    const lon = toNum(p.location.longitude);
    return (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      Math.abs(lat - cLat) <= epsLatDeg &&
      Math.abs(lon - cLon) <= epsLonDeg
    );
  });
}

interface StudyNearMemberSectionProps {
  myStudyInfo: StudyParticipationProps;
  members: StudyParticipationProps[];
}

function StudyNearMemberSection({ myStudyInfo, members }: StudyNearMemberSectionProps) {
  const userInfo = useUserInfo();
  const myCenterLocation = myStudyInfo?.location || userInfo?.locationDetail;

  const center = { latitude: myCenterLocation?.latitude, longitude: myCenterLocation?.longitude };

  const [isOpen, setIsOpen] = useState(false);

  // 위·경 각각 ±0.05도 이내
  const within = filterByLatLonEps(members, center, 0.04);

  const userCardArr: IProfileCommentCard[] = within?.map((member) => {
    const user = member.user;

    const participant = member as StudyParticipationProps;

    return {
      user: user,
      memo: participant.user.comment,
      rightComponent: (
        <Badge variant="subtle" colorScheme="blue" size="md">
          {getPlaceBranch(participant.location.address)}
        </Badge>
      ),
    };
  });

  return (
    <Box mt={5}>
      <Box mb={2} fontSize="18px" fontWeight="bold">
        내 주변 스터디 신청 멤버
      </Box>
      <ProfileCardColumn
        userCardArr={isOpen ? userCardArr : userCardArr?.slice(0, 3)}
        hasCommentButton={false}
      />
      {!isOpen && (
        <Button
          mt={2}
          w="100%"
          h="40px"
          bgColor="white"
          border="0.5px solid #E8E8E8"
          onClick={() => setIsOpen(true)}
        >
          더보기
        </Button>
      )}
    </Box>
  );
}

export default StudyNearMemberSection;
