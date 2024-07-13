import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";

import UserComment, { UserCommentProps } from "../../components/molecules/UserComment";
import WriteComment from "../../components/molecules/WriteComment";
import { useUserInfoQuery } from "../../hooks/user/queries";

export interface IGatherCommentUnit {
  gatherId: number;
  comment: string;
}

interface ICommentsLayout {
  comments: UserCommentProps[];
}

function CommentsLayout({ comments }: ICommentsLayout) {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";

  const { data: userInfo } = useUserInfoQuery();

  const [commentArr, setCommentArr] = useState<UserCommentProps[]>(comments);

  useEffect(() => {
    setCommentArr(comments);
  }, [comments]);

  return (
    <>
      <Layout>
        <span>할 얘기가 있다면 댓글을 남겨보세요</span>
        <Comment>
          {!isGuest && userInfo && <WriteComment setCommentArr={setCommentArr} />}

          <section>
            {commentArr?.map((props, idx) => (
              <UserComment
                commentProps={props}
                setCommentArr={setCommentArr}
                key={idx}
                isMine={props.user.uid === session?.user?.uid}
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

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
`;

export default CommentsLayout;
