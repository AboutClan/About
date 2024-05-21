import { useRouter } from "next/router";
import styled from "styled-components";

import ProfileIcon from "../../components/atoms/Profile/ProfileIcon";
import { useUidsToUsersInfoQuery, useUserInfoQuery } from "../../hooks/user/queries";
import { IModal } from "../../types/components/modalTypes";
import { birthToAge } from "../../utils/convertUtils/convertTypes";
import { IFooterOptions, ModalLayout } from "../Modals";

function ProfileCardModal({ setIsModal }: IModal) {
  const router = useRouter();
  const { data: userInfo } = useUserInfoQuery();

  const { data: friends } = useUidsToUsersInfoQuery(userInfo?.friend, {
    enabled: !!userInfo?.friend,
  });

  const onClickModify = () => {
    router.push(`/register/location?edit=on`);
  };

  const footerOptions: IFooterOptions = {
    main: {
      text: "프로필 변경",
      func: onClickModify,
    },
    sub: {},
  };
  return (
    <>
      <ModalLayout footerOptions={footerOptions} title={userInfo?.name} setIsModal={setIsModal}>
        <Profile>
          <ProfileUpPart>
            <div>
              <span>나이</span>
              <span> {birthToAge(userInfo?.birth)}</span>
            </div>
            <div>
              <span>성별</span>
              <span> {userInfo?.gender}</span>
            </div>
            <div>
              <span>MBTI</span>
              <span> {userInfo?.mbti}</span>
            </div>
            <div>
              <span>지역</span>
              <span> {userInfo?.location}</span>
            </div>
          </ProfileUpPart>
          <ProfileItem>
            <span>전공</span>
            <span>{userInfo?.majors[0].detail}</span>
          </ProfileItem>
          <ProfileItem>
            <span>관심사</span>
            <div>
              <span>1. {userInfo?.interests.first}</span>
              <span>2. {userInfo?.interests.second}</span>
            </div>
          </ProfileItem>
        </Profile>
        <FriendTitle>친구</FriendTitle>
        <FriendList>
          {friends?.map((who) => <ProfileIcon user={who} key={who.uid} size="sm" />)}
        </FriendList>
      </ModalLayout>
    </>
  );
}

const FriendTitle = styled.span`
  color: var(--gray-600);
`;

const ProfileUpPart = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  > div {
    display: flex;
    > span:first-child {
      color: var(--gray-600);
      width: 64px;
    }
    > span:last-child {
      font-weight: 600;
    }
  }
`;

const Profile = styled.div`
  margin-bottom: var(--gap-2);
  display: flex;
  flex-direction: column;
  line-height: 2.2;
`;

const ProfileItem = styled.div`
  display: flex;
  > span:first-child {
    display: inline-block;
    width: 64px;
    color: var(--gray-600);
  }
  > span:last-child {
    color: var(--gray-800);
    font-weight: 600;
  }
  > div {
    color: var(--gray-800);
    font-weight: 600;
    > span {
      display: inline-block;
      margin-right: var(--gap-3);
    }
  }
`;

const FriendList = styled.div`
  margin-top: 6px;
  flex: 1;
  border: 1px solid var(--gray-400);
  border-radius: var(--rounded-lg);
  padding: 6px 8px;
  display: flex;
`;

export default ProfileCardModal;
