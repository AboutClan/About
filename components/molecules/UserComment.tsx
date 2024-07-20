import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";

import CommentEditModal, { CommentEditModalType } from "../../modals/common/CommentEditModal";
import { UserCommentProps as CommentProps } from "../../types/components/propTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import { getDateDiff } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";

interface UserCommentProps extends CommentProps {
  setCommentArr: DispatchType<CommentProps[]>;
  type: CommentEditModalType;
}

function UserComment({ user, updatedAt, comment, _id, setCommentArr,type }: UserCommentProps) {
  const { data: session } = useSession();
  const [isEditModal, setIsEditModal] = useState(false);

  return (
    <>
      <Flex align="center" py="8px">
        <Flex justify="center" align="center" mr="12px">
          <Avatar size="sm" avatar={user.avatar} image={user.profileImage} uid={user.uid} />
        </Flex>
        <Flex direction="column" fontSize="12px" lineHeight={1.6} justify="space-around">
          <Flex align="center">
            <Box fontWeight={600} mr="4px">
              {user.name}
            </Box>
            <Box fontSize="10px" color="var(--gray-600)">
              {user.location} · {getDateDiff(dayjs(updatedAt))}
            </Box>
          </Flex>
          <p>
            {comment}
            {user.uid === session?.user.uid && (
              <Box as="span" ml="8px" onClick={() => setIsEditModal(true)}>
                <i className="fa-solid fa-ellipsis" />
              </Box>
            )}
          </p>
        </Flex>
      </Flex>
      {isEditModal && (
        <CommentEditModal
          comment={comment}
          commentId={_id}
          type={type}
          setIsModal={setIsEditModal}
          setCommentArr={setCommentArr}
          
        />
      )}
    </>
  );
}

export default UserComment;
