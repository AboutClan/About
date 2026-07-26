import { WarningIcon } from "@chakra-ui/icons";
import { Box, Flex } from "@chakra-ui/react";

import { useGroupsMineQuery } from "../../hooks/groupStudy/queries";
import { useUserInfoQuery } from "../../hooks/user/queries";

const POINT_PER_DEFICIT_TICKET = 1000;

function UserTicketDeductionNotice() {
  const { data: userInfo } = useUserInfoQuery();
  const { data: pendingGroups } = useGroupsMineQuery("pending");

  const requiredTicket =
    pendingGroups?.reduce(
      (acc, cur) => acc + (cur.isMember ? cur.requiredTicket - 1 : cur.requiredTicket),
      0,
    ) ?? 0;

  const currentTicket = userInfo?.ticket.groupStudyTicket ?? 0;
  const currentPoint = userInfo?.point ?? 0;

  const deficitTicket = Math.max(0, requiredTicket - currentTicket);
  const deductAmount = Math.min(deficitTicket * POINT_PER_DEFICIT_TICKET, Math.max(0, currentPoint));

  if (deductAmount <= 0) return null;

  const nextMonth = ((new Date().getMonth() + 1) % 12) + 1;

  return (
    <Flex
      align="center"
      gap={2}
      mx={5}
      mt={2}
      mb={3}
      px={3.5}
      py={2.5}
      borderRadius="14px"
      bg="rgba(255, 82, 82, 0.08)"
      border="1px solid rgba(255, 82, 82, 0.24)"
    >
      <WarningIcon boxSize="15px" color="red.400" flexShrink={0} />
      <Box fontSize="12.5px" lineHeight="17px" fontWeight={700} color="red.500">
        소모임 참여권이 부족해요. {nextMonth}월 1일 정산 시{" "}
        <Box as="span" fontWeight={800}>
          {deductAmount.toLocaleString()}P
        </Box>
        가 차감될 예정입니다.
      </Box>
    </Flex>
  );
}

export default UserTicketDeductionNotice;
