import { Box, Button, Flex } from "@chakra-ui/react";

import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import ProfileCommentCard from "../../molecules/cards/ProfileCommentCard";
import SocialingScoreBadge from "../../molecules/SocialingScoreBadge";

interface UserApprovalBoardProps {
  users: { user: UserSimpleInfoProps; text: string }[];
  handleApprove: (userId: string) => void;
  handleRefuse: (userId: string) => void;
}

function UserApprovalBoard({ users, handleApprove, handleRefuse }: UserApprovalBoardProps) {
  return (
    <Flex direction="column">
      {users?.map((user, idx) => (
        <Box key={idx} borderBottom="var(--border-main)" pb={3}>
          <ProfileCommentCard
            user={user.user}
            comment={{ comment: user.user.comment }}
            rightComponent={<SocialingScoreBadge user={user.user} size="sm" />}
            isNoBorder
          />
          <Flex justify="space-between" align="center">
            <Box fontWeight="semibold" color="var(--gray-600)" fontSize="12px">
              {user.text}
            </Box>
            <Flex>
              <Button
                variant="outline"
                size="sm"
                colorScheme="red"
                mr={3}
                onClick={() => handleRefuse(user.user._id)}
              >
                거절
              </Button>
              <Button size="sm" colorScheme="mint" onClick={() => handleApprove(user.user._id)}>
                승인
              </Button>
            </Flex>
          </Flex>
        </Box>
      ))}
    </Flex>
  );
}

export default UserApprovalBoard;
