import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

import { GATHER_CONTENT, GROUP_STUDY } from "../../constants/keys/queryKeys";
import {
  useCommentLikeMutation,
  useCommentMutation,
  useSubCommentMutation,
} from "../../hooks/common/mutations";
import CommentEditModal from "../../modals/common/CommentEditModal";
import { transferGatherDataState, transferGroupDataState } from "../../recoils/transferRecoils";
import { UserCommentProps as CommentProps } from "../../types/components/propTypes";
import { DispatchBoolean, DispatchType } from "../../types/hooks/reactTypes";
import { getDateDiff } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";

interface UserCommentProps extends Omit<CommentProps, "_id"> {
  isSecret?: boolean;
  setCommentArr: DispatchType<CommentProps[]>;
  type: "gather" | "group" | "feed" | "square";
  pageId: string;
  commentId?: string;
  parentId?: string;
  isReComment?: boolean;
  setIsReCommentInput: DispatchBoolean;
  likeList: string[];
  isAuthor: boolean;
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
  parentId,
  type,
  pageId,
  likeList,
  isAuthor,
}: UserCommentProps) {
  const queryClient = useQueryClient();

  const { data: session } = useSession();

  const setTransferGather = useSetRecoilState(transferGatherDataState);
  const setTransferGroup = useSetRecoilState(transferGroupDataState);

  const [text, setText] = useState(comment);
  const [isEditModal, setIsEditModal] = useState(false);
  const [likeArr, setLikeArr] = useState(likeList || []);

  const { mutate: handleLike } = useCommentLikeMutation(
    isReComment ? "subComment" : "comment",
    type,
    pageId,
  );

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

  const { mutate: handleEditSub } = useSubCommentMutation("patch", type, pageId, {
    onSuccess() {
      editCommentNow(text, commentId);
      onCompleted();
    },
  });
  const { mutate: handleDeleteSub } = useSubCommentMutation("delete", type, pageId, {
    onSuccess() {
      deleteCommentNow(commentId);
      onCompleted();
    },
  });

  const editCommentNow = (value: string, commentId: string) => {
    setCommentArr((old) => {
      return old.map((obj) =>
        obj._id === commentId
          ? { ...obj, comment: value }
          : {
              ...obj,
              subComments: obj.subComments.map((item) => {
                return item._id === commentId ? { ...item, comment: value } : item;
              }),
            },
      );
    });
  };

  const deleteCommentNow = (commentId: string) => {
    setCommentArr((old) => {
      return old
        .map((obj) => {
          if (obj._id === commentId) {
            // 메인 댓글 삭제
            return null;
          } else {
            const updatedSubComments = obj.subComments.filter((item) => item._id !== commentId);

            return { ...obj, subComments: updatedSubComments };
          }
        })
        .filter((obj) => obj !== null); // null인 메인 댓글 제거
    });
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

  const hasMyLike = likeArr?.some((user) => user === session?.user.id);

  const onClickLike = () => {
    if (hasMyLike || user._id === session?.user.id) return;

    handleLike({
      commentId: isReComment ? parentId : commentId,
      subCommentId: isReComment ? commentId : null,
    });
    setLikeArr((old) => [...old, session?.user.id]);
  };

  return (
    <>
      <Flex align="center" py="8px">
        <Flex justify="center" alignSelf="flex-start" mr="12px">
          <Avatar size="sm" avatar={user.avatar} image={user.profileImage} uid={user.uid} />
        </Flex>
        <Flex direction="column" fontSize="12px" lineHeight={1.6} justify="space-around">
          <Flex align="center">
            <Box fontWeight={600} mr="4px" color={isAuthor ? "var(--color-mint)" : "inherit"}>
              {user.name}
            </Box>
            <Box fontSize="10px" color="var(--gray-600)">
              {!isSecret && user.location} {!isSecret && "."} {getDateDiff(dayjs(updatedAt))}
            </Box>
          </Flex>
          <p>
            {comment}
            {user._id === session?.user.id && (
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
              color={hasMyLike ? "var(--color-mint)" : "var(--gray-600)"}
              fontSize="10px"
              fontWeight={hasMyLike ? 600 : 500}
              onClick={onClickLike}
              _focus={{ boxShadow: "none", background: "transparent" }}
            >
              좋아요 {likeArr.length}개
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
          commentId={isReComment ? parentId : commentId}
          setIsModal={setIsEditModal}
          setCommentArr={setCommentArr}
          handleEdit={isReComment ? handleEditSub : handleEdit}
          handleDelete={
            isReComment
              ? () => handleDeleteSub({ commentId: parentId, subCommentId: commentId })
              : handleDelete
          }
          subCommentId={isReComment ? commentId : undefined}
          isSecret={isSecret}
        />
      )}
    </>
  );
}

export default UserComment;
