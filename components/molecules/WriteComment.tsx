import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { GATHER_CONTENT } from "../../constants/keys/queryKeys";
import { useResetQueryData } from "../../hooks/custom/CustomHooks";
import { useGatherCommentMutation } from "../../hooks/gather/mutations";
import { useUserInfoQuery } from "../../hooks/user/queries";
import { DispatchType } from "../../types/hooks/reactTypes";
import { IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import { dayjsToStr } from "../../utils/dateTimeUtils";
import Avatar from "../atoms/Avatar";
import { UserCommentProps } from "./UserComment";

interface WriteCommentProps {
  setCommentArr: DispatchType<UserCommentProps[]>;
}

function WriteComment({ setCommentArr }: WriteCommentProps) {
  const router = useRouter();
  const gatherId = +router.query.id;
  const resetQueryData = useResetQueryData();

  const [value, setValue] = useState("");

  const { data: userInfo } = useUserInfoQuery();

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <MyCommnet>
      <Avatar size="sm" uid={userInfo.uid} avatar={userInfo.avatar} image={userInfo.profileImage} />
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
  );
}

const MyCommnet = styled.div`
  display: flex;
  min-height: 60px;
  align-items: center;
  flex: 1;
  margin-top: 12px;
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

export default WriteComment;
