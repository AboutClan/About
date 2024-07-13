import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";
import GatherCommentEditModal from "../../modals/gather/GatherCommentEditModal";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import { ITimeStamps } from "../../types/utils/timeAndDate";
import { getDateDiff } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";

export interface UserCommentProps extends ITimeStamps {
  user: IUserSummary;
  comment: string;
  _id?: string;
}

interface UserCommentBlockProps {
  commentProps: UserCommentProps;
  isMine: boolean;
  setCommentArr: DispatchType<UserCommentProps[]>;
}

function UserCommentBlock({ commentProps, isMine, setCommentArr }: UserCommentBlockProps) {
  const [isEditModal, setIsEditModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentId, setCommentId] = useState("");

  const user = commentProps.user;
  const comment = commentProps.comment;

  const onClickEdit = (commentId: string, text: string) => {
    setCommentId(commentId);
    setCommentText(text);
    setIsEditModal(true);
  };

  return (
    <>
      <CommentBlock>
        <div>
          <Avatar size="sm" avatar={user.avatar} image={user.profileImage} uid={user.uid} />
        </div>
        <CommentContent>
          <Name>
            <span>{user.name}</span>
            <CommentDetail>
              {user.location} · {getDateDiff(dayjs(commentProps.updatedAt))}
            </CommentDetail>
          </Name>
          <p>
            {comment}
            {isMine && (
              <IconWrapper onClick={() => onClickEdit(commentProps._id, comment)}>
                <i className="fa-solid fa-ellipsis" />
              </IconWrapper>
            )}
          </p>
        </CommentContent>
      </CommentBlock>
      {isEditModal && (
        <GatherCommentEditModal
          commentText={commentText}
          commentId={commentId}
          setIsModal={setIsEditModal}
          setCommentArr={setCommentArr}
        />
      )}
    </>
  );
}

const CommentBlock = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  > span:first-child {
    font-weight: 600;
    margin-right: var(--gap-1);
  }
`;

const IconWrapper = styled.span`
  margin-left: var(--gap-2);
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 68%;
  justify-content: space-around;
  margin-left: var(--gap-3);

  font-size: 12px;

  > span:last-child {
  }
`;

const CommentDetail = styled.span`
  font-size: 11px;
  color: var(--gray-600);
`;

export default UserCommentBlock;
