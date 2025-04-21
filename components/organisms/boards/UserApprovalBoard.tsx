import { Button, Flex } from "@chakra-ui/react";

import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import ProfileCommentCard from "../../molecules/cards/ProfileCommentCard";

interface UserApprovalBoardProps {
  users: { user: UserSimpleInfoProps; text: string }[];
  handleApprove: (userId: string) => void;
  handleRefuse: (userId: string) => void;
}

function UserApprovalBoard({ users, handleApprove, handleRefuse }: UserApprovalBoardProps) {
  return (
    <Flex direction="column">
      {users?.map((user, idx) => (
        <ProfileCommentCard
          key={idx}
          user={user.user}
          comment={{ comment: user.text }}
          rightComponent={
            <Flex>
              <Button
                variant="outline"
                size="sm"
                colorScheme="red"
                mr="12px"
                onClick={() => handleRefuse(user.user._id)}
              >
                거절
              </Button>
              <Button size="sm" colorScheme="mint" onClick={() => handleApprove(user.user._id)}>
                승인
              </Button>
            </Flex>
          }
        />
      ))}
    </Flex>
  );
}

export default UserApprovalBoard;
