import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import UserComment from "../../../components/molecules/UserComment";
import { GATHER_CONTENT } from "../../../constants/keys/queryKeys";
import { useResetQueryData } from "../../../hooks/custom/CustomHooks";
import { useGatherCommentMutation } from "../../../hooks/gather/mutations";
import { useUserInfoQuery } from "../../../hooks/user/queries";
import { UserCommentProps } from "../../../types/components/propTypes";

import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../../utils/dateTimeUtils";
export interface IGatherCommentUnit {
  gatherId: number;
  comment: string;
}

interface IGatherComments {
  comment: UserCommentProps[];
}

function GatherComments({ comment }: IGatherComments) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const router = useRouter();
  const gatherId = +router.query.id;
  const { data: userInfo } = useUserInfoQuery();
  const [value, setValue] = useState("");

  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comment);

  useEffect(() => {
    setCommentArr(comment);
  }, [comment]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const resetQueryData = useResetQueryData();

  const { mutate: writeComment } = useGatherCommentMutation("post", gatherId, {
    onSuccess() {
      setCommentArr((old) => [...old, addNewComment(userInfo, value)]);
      setValue("");
      resetQueryData([GATHER_CONTENT]);
    },
  });

  const addNewComment = (user: IUserSummary, comment: string): UserCommentProps => {
    return {
      user,
      comment,
      createdAt: dayjsToStr(dayjs()),
    };
  };

  const onSubmit = () => {
    writeComment({ comment: value });
  };

  return (
    <>
      <Layout>
        <span>할 얘기가 있다면 댓글을 남겨보세요</span>
        <Comment>
          {!isGuest && userInfo && (
            <MyCommnet>
              <Avatar
                size="sm"
                uid={userInfo.uid}
                avatar={userInfo.avatar}
                image={userInfo.profileImage}
              />
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
            {commentArr?.map((item, idx) => (
              <UserComment
                type="gather"
                key={idx}
                user={item.user}
                updatedAt={item.updatedAt}
                comment={item.comment}
                _id={item._id}
                setCommentArr={setCommentArr}
              />
            ))}
          </section>
        </Comment>
      </Layout>
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

export default GatherComments;
