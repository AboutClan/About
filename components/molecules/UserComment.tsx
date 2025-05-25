import { Box, Button, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useState } from "react";

import {
  useCommentLikeMutation,
  useCommentMutation,
  useSubCommentMutation,
} from "../../hooks/common/mutations";
import CommentEditModal from "../../modals/common/CommentEditModal";
import { ReplyProps } from "../../pageTemplates/community/SecretSquareComments";
import { UserCommentProps as CommentProps } from "../../types/components/propTypes";
import { DispatchType } from "../../types/hooks/reactTypes";
import { getDateDiff } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";
import { EllipsisIcon } from "../Icons/DotIcons";

interface UserCommentProps extends Omit<CommentProps, "_id"> {
  isSecret?: boolean;
  setCommentArr?: DispatchType<CommentProps[]>;
  type: "gather" | "group" | "feed" | "square";
  pageId: string;
  commentId?: string;
  parentId?: string;
  isReComment?: boolean;
  setReplyProps: DispatchType<ReplyProps>;
  likeList: string[];
  isAuthor: boolean;
  hasAuthority: boolean;
}

function UserComment({
  isSecret,
  user,
  updatedAt,
  comment,
  setReplyProps,
  commentId,
  setCommentArr,
  isReComment,
  parentId,
  type,
  pageId,
  likeList,
  hasAuthority,
}: UserCommentProps) {
  const { data: session } = useSession();

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
    // if (type === "gather") {
    //   setTransferGather(null);
    //   queryClient.invalidateQueries([GATHER_CONTENT, pageId]);
    // }
    // if (type === "group") {
    //   setTransferGroup(null);
    //   queryClient.invalidateQueries([GROUP_STUDY, pageId]);
    // }
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
      <Flex px={5} align="center" py={3} borderBottom="var(--border)">
        <Flex justify="center" alignSelf="flex-start" mr={2}>
          <Avatar size="sm1" user={user} />
        </Flex>
        <Flex w="full" direction="column" fontSize="12px" lineHeight={1.6} justify="space-around">
          <Flex w="full" justify="space-between" mb={1}>
            <Box fontWeight="bold" fontSize="13px" lineHeight="20px" color="gray.800">
              {user.name}
            </Box>
            {session?.user.uid === user.uid && (
              <Button variant="unstyled" onClick={() => setIsEditModal(true)}>
                <EllipsisIcon size="sm" />
              </Button>
            )}
            {/* <Box fontSize="10px" color="var(--gray-600)">
              {!isSecret && user.location} {!isSecret && "."} {getDateDiff(dayjs(updatedAt))}
            </Box> */}
          </Flex>
          <Box mb={2} as="p" fontWeight="light" fontSize="12px" lineHeight="18px">
            {comment}
            {/* {user._id === session?.user.id && (
              <Box as="span" ml="8px" onClick={() => setIsEditModal(true)}>
                <i className="fa-solid fa-ellipsis" />
              </Box>
            )} */}
          </Box>{" "}
          <Flex h="16px" align="center" fontSize="10px" color="gray.600">
            <Button
              px="0"
              h="16px"
              size="xs"
              variant="ghost"
              color="gray.600"
              fontSize="10px"
              fontWeight="regular"
              onClick={onClickLike}
              _focus={{ boxShadow: "none", background: "transparent" }}
            >
              좋아요 {likeArr.length}개
            </Button>
            {!isReComment && hasAuthority && (
              <>
                <Box mx={1} w="1px" h="6px" bg="gray.200" my="auto" />
                <Button
                  px="0"
                  size="xs"
                  fontSize="10px"
                  variant="ghost"
                  color="var(--gray-600)"
                  fontWeight={500}
                  onClick={() => {
                    console.log(1234, commentId, user.name, parentId);
                    return;
                    setReplyProps({
                      replyName: user.name,
                      commentId,
                      parentId,
                    });
                  }}
                >
                  답글 달기
                </Button>
              </>
            )}
            <Box mx={1} w="1px" h="6px" bg="gray.200" my="auto" />
            <Box color="gray.600" fontWeight="500">
              {getDateDiff(dayjs(updatedAt))}
            </Box>
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
