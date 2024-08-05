import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { prevPageUrlState } from "../../recoils/previousAtoms";
import { IUser, IUserSummary } from "../../types/models/userTypes/userInfoTypes";
import Avatar from "../atoms/Avatar";

interface IUserItem {
  user: IUserSummary | IUser;

  children: React.ReactNode;
}

export function UserItem({ user, children }: IUserItem) {
  const router = useRouter();

  const setBeforePage = useSetRecoilState(prevPageUrlState);
  const onClickProfile = (user: IUserSummary) => {
    setBeforePage(router?.asPath);
    router.push(`/profile/${user.uid}`);
  };
  return (
    <MemberItem key={user.uid} onClick={() => onClickProfile(user)}>
      <Avatar image={user.profileImage} avatar={user.avatar} uid={user.uid} size="sm" />
      <UserOverview>
        <span>{user?.name}</span>
        <div>{user.comment}</div>
      </UserOverview>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </MemberItem>
  );
}

const MemberItem = styled.div`
  padding: var(--gap-2) 0;
  display: flex;
  align-items: center;

  border-bottom: var(--border);
`;

const UserOverview = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  margin-left: var(--gap-3);
  > span:first-child {
    font-size: 14px;
    font-weight: 600;
  }
  > div:last-child {
    width: 95%;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 13px;
  }
`;

const ChildrenWrapper = styled.div``;
