import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import { Input } from "../../components/atoms/Input";
import { GATHER_CONTENT, GROUP_STUDY_ALL } from "../../constants/keys/queryKeys";
import { useResetQueryData } from "../../hooks/custom/CustomHooks";
import { useGatherCommentMutation } from "../../hooks/gather/mutations";
import { useGroupCommentMutation } from "../../hooks/groupStudy/mutations";
import { IModal } from "../../types/components/modalTypes";
import { UserCommentProps } from "../../types/components/propTypes";
import { DispatchType } from "../../types/hooks/reactTypes";

import { IFooterOptions, ModalLayout } from "../Modals";

export type CommentEditModalType = "gather" | "group";

interface CommentEditModalProps extends IModal {
  comment: string;
  commentId: string;
  type: "gather" | "group";
  setCommentArr?: DispatchType<UserCommentProps[]>;
}

function CommetEditModal({
  comment,
  setIsModal,
  commentId,
  type,
  setCommentArr,
}: CommentEditModalProps) {
  const router = useRouter();
  const gatherId = +router.query.id;

  const [isFirst, setIsFirst] = useState(true);
  const [value, setValue] = useState(comment);

  const resetQueryData = useResetQueryData();

  const editCommentNow = (value: string, commentId: string) => {
    setCommentArr((old) =>
      old.map((obj) => (obj._id === commentId ? { ...obj, comment: value } : obj)),
    );
  };

  const deleteCommentNow = (commentId: string) => {
    setCommentArr((old) => old.filter((obj) => obj._id !== commentId));
  };

  const { mutate: deleteCommentGroup } = useGroupCommentMutation("delete", gatherId, {
    onSuccess() {
      resetQueryData([GROUP_STUDY_ALL]);
      deleteCommentNow(commentId);
    },
  });
  const { mutate: editCommentGroup } = useGroupCommentMutation("patch", gatherId, {
    onSuccess() {
      resetQueryData([GROUP_STUDY_ALL]);
      editCommentNow(value, commentId);
    },
  });
  const { mutate: deleteComment } = useGatherCommentMutation("delete", gatherId, {
    onSuccess() {
      resetQueryData([GATHER_CONTENT]);
      deleteCommentNow(commentId);
    },
  });
  const { mutate: editComment } = useGatherCommentMutation("patch", gatherId, {
    onSuccess() {
      resetQueryData([GATHER_CONTENT]);
      editCommentNow(value, commentId);
    },
  });

  const onComplete = () => {
    setIsModal(false);
  };

  const onDelete = async () => {
    if (type === "group") deleteCommentGroup({ commentId });
    else deleteComment({ commentId });
    onComplete();
  };

  const onEdit = () => {
    if (type === "group") editCommentGroup({ comment: value, commentId });
    else editComment({ comment: value, commentId });
    onComplete();
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "변경",
      func: onEdit,
    },
    sub: {
      text: "취소",
    },
    isFull: false,
  };

  return (
    <ModalLayout
      title=""
      headerOptions={{}}
      footerOptions={isFirst ? null : footerOptions}
      setIsModal={setIsModal}
      paddingOptions={{
        header: 0,
        footer: 0,
      }}
    >
      <Container>
        {isFirst ? (
          <>
            <button onClick={() => setIsFirst(false)}>수정하기</button>
            <button onClick={onDelete}>삭제하기</button>
          </>
        ) : (
          <>
            <Input size="sm" value={value} onChange={(e) => setValue(e.target.value)} />
          </>
        )}
      </Container>
    </ModalLayout>
  );
}

const Container = styled.div`
  height: 100%;
  margin-bottom: var(--gap-4);
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  align-items: flex-start;
  > button {
    padding: 12px;

    width: 100%;
    :focus {
      outline: none;
    }
  }
`;

export default CommetEditModal;
