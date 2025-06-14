import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { UserSimpleInfoProps } from "../../../types/models/userTypes/userInfoTypes";
import AlertModal from "../../AlertModal";
import ProfileCommentCard from "../../molecules/cards/ProfileCommentCard";

interface UserAbsenceBoardProps {
  users: { user: UserSimpleInfoProps; text: string; isAbsence: boolean }[];

  handleDelete: (userId: string) => void;
}

function UserAbsenceBoard({ users, handleDelete }: UserAbsenceBoardProps) {
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
                <Button
                  isDisabled={user?.isAbsence ? true : false}
                  size="sm"
                  colorScheme="red"
                  onClick={() => setDeleteUserId(user.user._id)}
                >
                  불참했어요
                </Button>
              </Flex>
            }
          />
        ))}
      </Flex>
      {deleteUserId && (
        <AlertModal
          options={{
            title: "불참 체크",
            subTitle: `모임 직전에 불참한 인원인가요?`,
            func: () => {
              handleDelete(deleteUserId);
              setDeleteUserId(null);
            },
            text: "불참했어요",
          }}
          setIsModal={() => setDeleteUserId(null)}
        />
      )}
    </>
  );
}

export default UserAbsenceBoard;
