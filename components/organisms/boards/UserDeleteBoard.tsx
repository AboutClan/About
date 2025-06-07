import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import AlertModal from "../../AlertModal";
import ProfileCommentCard from "../../molecules/cards/ProfileCommentCard";

interface UserDeleteBoardProps {
  users: { user: UserSimpleInfoProps; text: string }[];

  handleDelete: (userId: string) => void;
}

function UserDeleteBoard({ users, handleDelete }: UserDeleteBoardProps) {
  const [deleteUserId, setDeleteUserId] = useState<string>(null);

  return (
    <>
      <Flex direction="column">
        {users?.map((user, idx) => (
          <ProfileCommentCard
            key={idx}
            user={user.user}
            comment={{ comment: user.text }}
            rightComponent={
              <Flex>
                <Button size="sm" colorScheme="red" onClick={() => setDeleteUserId(user.user._id)}>
                  내보내기
                </Button>
              </Flex>
            }
          />
        ))}
      </Flex>
      {deleteUserId && (
        <AlertModal
          options={{
            title: "내보내기",
            subTitle: `정말 내보내시겠어요?`,
            func: () => {
              handleDelete(deleteUserId);
              setDeleteUserId(null);
            },
            text: "내보내기",
          }}
          setIsModal={() => setDeleteUserId(null)}
        />
      )}
    </>
  );
}

export default UserDeleteBoard;
