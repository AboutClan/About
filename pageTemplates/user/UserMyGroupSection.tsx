import { Box } from "@chakra-ui/react";

import { PopOverIcon } from "../../components/Icons/PopOverIcon";
import InfoBoxCol from "../../components/molecules/InfoBoxCol";
import { useGroupMyStatusQuery } from "../../hooks/groupStudy/queries";
import { getUserMonthTicket } from "../../libs/userEventLibs/userHelpers";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
interface UserMyGroupSectionProps {
  user: IUser;
}

function UserMyGroupSection({ user }: UserMyGroupSectionProps) {
  const { data: groupData } = useGroupMyStatusQuery(null, "isParticipating");

  const ticketSum = groupData?.reduce((acc, cur) => acc + cur.requiredTicket, 0);

  const { gatherTicket, groupStudyTicket } = getUserMonthTicket(
    user?.temperature?.temperature || 36.5,
  );

  return (
    <Box mx={5} mt={3}>
      <Box p={4} pb={3} borderRadius="12px" border="var(--border)">
        <InfoBoxCol
          infoBoxPropsArr={[
            {
              category: "월간 동아리 점수",
              text: `${(user?.monthScore / 20) * 100}% 달성`,
            },
            {
              category: "내 소셜링 온도",
              text: `${user?.temperature?.temperature || 36.5}°C`,
            },
            {
              category: "매월 충전되는 번개/소모임 참여권",
              text: `${gatherTicket + (user?.gender === "여성" ? 1 : 0)} 장 / ${
                groupStudyTicket + (user?.gender === "여성" ? 2 : 0)
              } 장`,
              leftChildren: (
                <PopOverIcon text="참여권은 매월 초기화되며, 소셜링 온도가 높을수록 많은 참여권이 지급됩니다." />
              ),
            },
            {
              category: "매월 차감되는 소모임 참여권",
              text: !groupData ? "" : ticketSum ? `${ticketSum} 장` : "없음",
              color: null,
              leftChildren: (
                <PopOverIcon text="소모임 참여 시, 모임마다 매월 0~2개의 참여권이 소요됩니다." />
              ),
            },
          ]}
          size="md"
        />
      </Box>
    </Box>
  );
}

export default UserMyGroupSection;
