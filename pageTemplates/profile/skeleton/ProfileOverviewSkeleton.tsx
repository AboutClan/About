import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

function ProfileOverviewSkeleton() {
  return (
    <>
      <Top>
        <Profile>
          <ProfileIcon>
            <Skeleton>temp</Skeleton>
          </ProfileIcon>
          <ProfileInfo>
            <div>
              <span>
                <Skeleton>temp</Skeleton>
              </span>
              <Badge>
                <Skeleton>temp</Skeleton>
              </Badge>
            </div>
            <Status>
              <Skeleton>temp</Skeleton>
            </Status>
          </ProfileInfo>
        </Profile>
        <Comment>
          <Skeleton>temp</Skeleton>
        </Comment>
      </Top>
      <Bottom>
        <div>
          <RelationItem>
            <span>친구</span>
            <span>
              <Skeleton>0</Skeleton>
            </span>
          </RelationItem>
          <RelationItem>
            <span>좋아요</span>
            <span>
              <Skeleton>0</Skeleton>
            </span>
          </RelationItem>
          <RelationItem>
            <span>활동</span>
            <span>
              <Skeleton>0</Skeleton>
            </span>
          </RelationItem>
        </div>
        <Button>
          <Skeleton>temp</Skeleton>
        </Button>
      </Bottom>
    </>
  );
}

const Status = styled.span`
  margin-top: 2px;
  width: 48px;
  height: 16px;
`;

const Top = styled.div``;

const Button = styled.div`
  width: 70px;
  height: 26px;
`;
const Bottom = styled.div`
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
  > div:first-child {
    display: flex;
  }
`;

const RelationItem = styled.div`
  width: max-content;
  padding: 0 var(--gap-2);

  display: flex;
  flex-direction: column;
  line-height: 2;
  align-items: center;
  > span:first-child {
    font-size: 12px;
  }
  > span:last-child {
    display: inline-block;

    text-align: center;
    width: 20px;
    font-size: 12px;
    font-weight: 600;
  }
`;
const ProfileIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
`;
const Profile = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Badge = styled.div`
  width: 64px;
  height: 20px;
`;

const ProfileInfo = styled.div`
  margin-left: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > div:first-child {
    display: flex;
    align-items: center;
    > span:first-child {
      display: inline-block;
      width: 48px;
      font-size: 16px;
      font-weight: 600;
      margin-right: 8px;
    }
  }
  > span:last-child {
    font-size: 12px;
    color: var(--gray-700);
  }
`;

const Comment = styled.div`
  margin-left: var(--gap-1);
  margin-top: var(--gap-3);
  color: var(--gray-900);
  font-size: 12px;
  font-weight: 600;
  width: 140px;
`;

export default ProfileOverviewSkeleton;
