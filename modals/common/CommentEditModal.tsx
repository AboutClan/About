import { useState } from "react";
import styled from "styled-components";

import { Input } from "../../components/atoms/Input";
import { CommentParamProps, SubCommentParamProps } from "../../hooks/common/mutations";
import { IModal } from "../../types/components/modalTypes";
import { UserCommentProps } from "../../types/components/propTypes";
import { DispatchString, DispatchType } from "../../types/hooks/reactTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

interface CommentEditModalProps extends IModal {
  text: string;
  setText: DispatchString;
  commentId: string;
  subCommentId?: string;
  setCommentArr?: DispatchType<UserCommentProps[]>;
  handleEdit: (param: CommentParamProps<"patch"> | SubCommentParamProps) => void;
  handleDelete: (param: CommentParamProps<"delete"> | SubCommentParamProps) => void;
  isSecret?: boolean;
}

function CommentEditModal({
  text,
  setText,
  setIsModal,
  commentId,
  subCommentId,
  handleDelete,
  handleEdit,
  isSecret,
}: CommentEditModalProps) {
  const [isFirst, setIsFirst] = useState(true);
  console.log(commentId, subCommentId);
  const footerOptions: IFooterOptions = {
    main: {
      text: "변경",
      func: () => handleEdit({ comment: text, commentId, subCommentId }),
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
            {!isSecret && <button onClick={() => setIsFirst(false)}>수정하기</button>}
            <button onClick={() => handleDelete({ commentId })}>삭제하기</button>
          </>
        ) : (
          <>
            <Input size="sm" value={text} onChange={(e) => setText(e.target.value)} />
          </>
        )}
      </Container>
    </ModalLayout>
  );
}

const Container = styled.div`
  height: 100%;

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

export default CommentEditModal;
