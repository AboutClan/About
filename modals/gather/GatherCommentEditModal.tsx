import { useRouter } from "next/router";
import { useState } from "react";
import styled from "styled-components";

import { GATHER_CONTENT, GROUP_STUDY_ALL } from "../../constants/keys/queryKeys";
import { useResetQueryData } from "../../hooks/custom/CustomHooks";
import { useGatherCommentMutation } from "../../hooks/gather/mutations";
import { useGroupCommentMutation } from "../../hooks/groupStudy/mutations";
import { IModal } from "../../types/components/modalTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface IGatherCommentEditModal extends IModal {
  commentText: string;
  commentId: string;
  type?: "group";
}

function GatherCommentEditModal({
  commentText,
  setIsModal,
  commentId,
  type,
}: IGatherCommentEditModal) {
  const router = useRouter();
  const gatherId = +router.query.id;

  const [isFirst, setIsFirst] = useState(true);
  const [value, setValue] = useState(commentText);

  const resetQueryData = useResetQueryData();

  const { mutate: deleteCommentGroup } = useGroupCommentMutation("delete", gatherId, {
    onSuccess() {
      resetQueryData([GROUP_STUDY_ALL]);
    },
  });
  const { mutate: editCommentGroup } = useGroupCommentMutation("patch", gatherId, {
    onSuccess() {
      resetQueryData([GROUP_STUDY_ALL]);
    },
  });
  const { mutate: deleteComment } = useGatherCommentMutation("delete", gatherId, {
    onSuccess() {
      resetQueryData([GATHER_CONTENT]);
    },
  });
  const { mutate: editComment } = useGatherCommentMutation("patch", gatherId, {
    onSuccess() {
      resetQueryData([GATHER_CONTENT]);
    },
  });

  const onComplete = () => {
    setIsModal(false);
  };

  const onDelete = () => {
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
  };

  return (
    <ModalLayout title="" footerOptions={isFirst ? null : footerOptions} setIsModal={setIsModal}>
      <Container>
        {isFirst ? (
          <>
            <button onClick={() => setIsFirst(false)}>수정하기</button>
            <button onClick={onDelete}>삭제하기</button>
          </>
        ) : (
          <>
            <Input value={value} onChange={(e) => setValue(e.target.value)} />
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
    :focus {
      outline: none;
    }
  }
`;

const Input = styled.input`
  margin-top: var(--gap-2);
  padding: var(--gap-2);
  width: 100%;
  border: var(--border);
  border-radius: var(--rounded-lg);
  font-size: 12px;
  :focus {
    outline: none;
    border: 2px solid var(--color-mint);
  }
`;

export default GatherCommentEditModal;
