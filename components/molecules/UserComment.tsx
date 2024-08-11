import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { GATHER_CONTENT, GROUP_STUDY } from "../../constants/keys/queryKeys";

import { useCommentMutation } from "../../hooks/common/mutations";
import CommentEditModal from "../../modals/common/CommentEditModal";
import { transferGatherDataState, transferGroupDataState } from "../../recoils/transferRecoils";
import { UserCommentProps as CommentProps } from "../../types/components/propTypes";
import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import { getDateDiff } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";
import SecretAvatar from "../atoms/SecretAvatar";

interface UserCommentProps extends Omit<CommentProps, "_id"> {
  isSecret?: boolean;
  setCommentArr: DispatchType<CommentProps[]>;
  type: "gather" | "group" | "feed" | "square";
  pageId: string;
  commentId?: string;
  isReComment?: boolean;
  setIsReCommentInput: DispatchBoolean;
}

function UserComment({
  isSecret,
  user,
  updatedAt,
  comment,
  setIsReCommentInput,
  commentId,
  setCommentArr,
  isReComment,
  type,
  pageId,
}: UserCommentProps) {
  const queryClient = useQueryClient();

  const { data: session } = useSession();

  const setTransferGather = useSetRecoilState(transferGatherDataState);
  const setTransferGroup = useSetRecoilState(transferGroupDataState);

  const [text, setText] = useState(comment);
  const [isEditModal, setIsEditModal] = useState(false);

  const { mutate: handleEdit } = useCommentMutation("patch", type, pageId, {
    onSuccess() {
      editCommentNow(text, commentId);
      onCompleted();
    },
  });
  const { mutate: handleDelete } = useCommentMutation("delete", type, pageId, {
    onSuccess() {
      deleteCommentNow(commentId);
      onCompleted();
    },
  });

  const editCommentNow = (value: string, commentId: string) => {
    setCommentArr((old) =>
      old.map((obj) => (obj._id === commentId ? { ...obj, comment: value } : obj)),
    );
  };

  const deleteCommentNow = (commentId: string) => {
    setCommentArr((old) => old.filter((obj) => obj._id !== commentId));
  };

  const onCompleted = () => {
    if (type === "gather") {
      setTransferGather(null);
      queryClient.invalidateQueries([GATHER_CONTENT, pageId]);
    }
    if (type === "group") {
      setTransferGroup(null);
      queryClient.invalidateQueries([GROUP_STUDY, pageId]);
    }
    setIsEditModal(false);
  };
  console.log(24, isSecret);
  return (
    <>
      <Flex align="center" py="8px">
        <Flex justify="center" alignSelf="flex-start" mr="12px">
          {!isSecret ? (
            <Avatar size="sm" avatar={user.avatar} image={user.profileImage} uid={user.uid} />
          ) : (
            <SecretAvatar />
          )}
        </Flex>
        <Flex direction="column" fontSize="12px" lineHeight={1.6} justify="space-around">
          <Flex align="center">
            <Box fontWeight={600} mr="4px">
              {isSecret ? "익명1" : user.name}
            </Box>
            <Box fontSize="10px" color="var(--gray-600)">
              {!isSecret && user.location} {!isSecret && "."} {getDateDiff(dayjs(updatedAt))}
            </Box>
          </Flex>
          <p>
            {comment}
            {user.uid === session?.user.uid && (
              <Box as="span" ml="8px" onClick={() => setIsEditModal(true)}>
                <i className="fa-solid fa-ellipsis" />
              </Box>
            )}
          </p>{" "}
          <Flex>
            <Button
              px="0"
              size="xs"
              variant="ghost"
              color="var(--gray-600)"
              fontSize="10px"
              fontWeight={500}
            >
              좋아요 0개
            </Button>
            {!isReComment && (
              <Button
                ml="12px"
                px="0"
                size="xs"
                variant="ghost"
                color="var(--gray-600)"
                fontSize="10px"
                fontWeight={500}
                onClick={() => setIsReCommentInput(true)}
              >
                답글 달기
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>

      {isEditModal && (
        <CommentEditModal
          text={text}
          setText={setText}
          commentId={commentId}
          setIsModal={setIsEditModal}
          setCommentArr={setCommentArr}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}

export default UserComment;
