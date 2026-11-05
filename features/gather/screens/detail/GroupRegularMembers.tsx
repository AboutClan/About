import { Box, Flex, Text } from "@chakra-ui/react";

import Avatar from "@/components/atoms/Avatar";
import ParticipationBar from "@/components/atoms/bars/ParticipationBar";
import { IGather } from "@/types/models/gatherTypes/gatherTypes";
import { UserSimpleInfoProps } from "@/types/models/userTypes/userInfoTypes";

interface GroupRegularMembersProps {
  data: IGather;
  /** 공개 페이지: 프로필 이동 대신 안내 토스트 */
  lockedToast?: string;
}

/**
 * 소모임형 상시 행사 상세: 소모임 모임에 1회 이상 참여한 소모임 멤버(서버가 참여 많은 순으로 내려 줌).
 */
function GroupRegularMembers({ data, lockedToast }: GroupRegularMembersProps) {
  const members = data.groupMembers ?? [];

  return (
    <Flex flexDir="column" px={5}>
      <ParticipationBar
        type="pending"
        label="함께하는 멤버"
        participantsCnt={members.length}
        maxCnt={data.memberCnt?.max}
      />
      {!members.length ? (
        <Text py={4} fontSize="13px" color="gray.500">
          아직 함께한 멤버가 없어요.
        </Text>
      ) : (
        members.map((member) => (
          <Flex key={member._id} py={2.5} align="center" borderBottom="var(--border)">
            <Avatar
              user={member as unknown as UserSimpleInfoProps}
              size="md1"
              lockedToast={lockedToast}
            />
            <Box ml={3} fontSize="13px" fontWeight="semibold" lineHeight="20px">
              {member.nickname || "어바웃 멤버"}
            </Box>
          </Flex>
        ))
      )}
    </Flex>
  );
}

export default GroupRegularMembers;
