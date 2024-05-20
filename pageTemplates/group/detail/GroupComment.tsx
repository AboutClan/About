import dayjs from "dayjs";
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import ProfileIcon from "../../../components/atoms/Profile/ProfileIcon";
import { GROUP_STUDY_ALL } from "../../../constants/keys/queryKeys";
// import { Group_CONTENT } from "../../../constants/keys/queryKeys";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useGroupCommentMutation } from "../../../hooks/groupStudy/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import GatherCommentEditModal from "../../../modals/gather/GatherCommentEditModal";
import { IGatherComment } from "../../../types/models/gatherTypes/gatherTypes";
import { getDateDiff } from "../../../utils/dateTimeUtils";
// import GroupCommentEditModal from "../../../modals/group/GroupCommentEditModal";

export interface IGroupCommentUnit {
  GroupId: number;
  comment: string;
}

interface IGroupComments {
  comment: IGatherComment[];
}

function GroupComments({ comment }: IGroupComments) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const router = useRouter();
  const GroupId = +router.query.id;
  const { data: userInfo } = useUserInfoQuery();
  const [value, setValue] = useState("");

  const [isEditModal, setIsEditModal] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [commentId, setCommentId] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const resetQueryData = useResetQueryData();

  const { mutate: writeComment } = useGroupCommentMutation("post", GroupId, {
    onSuccess() {
      resetQueryData([GROUP_STUDY_ALL]);
    },
  });
  const onSubmit = () => {
    writeComment({ comment: value });
    setValue("");
  };

  const onClickEdit = (commentId, text) => {
    setCommentId(commentId);
    setCommentText(text);
    setIsEditModal(true);
  };

  return (
    <>
      <Layout>
        <span>할 얘기가 있다면 댓글을 남겨보세요</span>
        <Comment>
          {!isGuest && (
            <MyCommnet>
              <ProfileIcon user={userInfo && userInfo} size="xs" />
              <MyText
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="댓글 달기..."
              />
              <SubmitBtn focus={value !== ""} onClick={onSubmit}>
                등록
              </SubmitBtn>
            </MyCommnet>
          )}
          <section>
            {comment?.map((item) => (
              <CommentBlock key={item._id}>
                <div>
                  <Avatar
                    image={item.user.profileImage}
                    avatar={item.user.avatar}
                    uid={item.user.uid}
                    size="smd"
                  />
                </div>
                <CommentContent>
                  <Name>
                    <span>{item.user.name}</span>
                    <CommentDetail>
                      {item.user.location} · {getDateDiff(dayjs(item.updatedAt))}
                    </CommentDetail>
                  </Name>
                  <p>
                    {item.comment}
                    {item.user.uid === session?.user?.uid && (
                      <IconWrapper onClick={() => onClickEdit(item._id, item.comment)}>
                        <i className="fa-light fa-ellipsis" />
                      </IconWrapper>
                    )}
                  </p>
                </CommentContent>
              </CommentBlock>
            ))}
          </section>
        </Comment>
      </Layout>
      {isEditModal && (
        <GatherCommentEditModal
          commentText={commentText}
          commentId={commentId}
          setIsModal={setIsEditModal}
          type="group"
        />
      )}
    </>
  );
}

const Layout = styled.div`
  margin: var(--gap-5) var(--gap-4);
  display: flex;
  flex-direction: column;
  > span:first-child {
    font-weight: 700;
  }
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

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
`;

const MyCommnet = styled.div`
  display: flex;
  min-height: 60px;
  align-items: center;
  flex: 1;
  margin-top: 12px;
`;

const CommentBlock = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 68%;
  justify-content: space-around;
  margin-left: var(--gap-3);

  font-size: 12px;

  > span:last-child {
    color: var(--gray-2);
  }
`;

const CommentDetail = styled.span`
  font-size: 11px;
  color: var(--gray-700);
`;

const MyText = styled.textarea`
  margin-left: var(--gap-3);
  flex: 1;
  background-color: inherit;
  height: 21px;
  :focus {
    outline: none;
  }
  ::placeholder {
    font-size: 12px;
  }
`;

const SubmitBtn = styled.button<{ focus: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.focus ? "var(--color-mint)" : "var(--gray-500)")};
`;

export default GroupComments;
