import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import Avatar from "../../../components/atoms/Avatar";
import { GROUP_STUDY_ROLE } from "../../../constants/settingValue/groupStudy";
import { useToast } from "../../../hooks/custom/CustomToast";
import { prevPageUrlState } from "../../../recoils/previousAtoms";
import { IGroup } from "../../../types/models/groupTypes/group";
import { IUserSummary } from "../../../types/models/userTypes/userInfoTypes";

interface IGroupParticipation {
  data: IGroup;
}

function GroupParticipation({ data }: IGroupParticipation) {
  const router = useRouter();
  const toast = useToast();
  const setBeforePage = useSetRecoilState(prevPageUrlState);

  const status = data.status;
  const participantsCnt = data.participants.length + (data.id === 33 ? 3 : 0);

  const onClickProfile = (user: IUserSummary) => {
    setBeforePage(router?.asPath);
    router.push(`/profile/${user.uid}`);
  };

  const outMemberCnt = data?.id === 33 ? 3 : 0;
  const array = new Array(outMemberCnt).fill(0);
  const onClickOutMember = () => {
    toast("error", "외부 게스트의 프로필은 확인할 수 없습니다.");
  };

  return (
    <Layout>
      <Header>
        <span>{status === "open" ? "확정 인원" : "참여중인 인원"}</span>
        <span>{participantsCnt}</span>
        <span>/</span>
        {data?.memberCnt.max ? (
          <span>{data?.memberCnt.max}</span>
        ) : (
          <>
            <span style={{ marginLeft: "4px" }} />
            <i className="fa-solid fa-infinity" style={{ color: "var(--gray-200)" }} />
          </>
        )}
      </Header>
      <Members>
        {data?.participants.map(
          (who) =>
            who && (
              <MemberItem key={who?.user?.uid} onClick={() => onClickProfile(who?.user)}>
                <ProfileWrapper>
                  <Avatar
                    image={who.user.profileImage}
                    avatar={who.user?.avatar}
                    size="md"
                    uid={who.user.uid}
                  />
                  {who?.role === "admin" && (
                    <Crown>
                      <i className="fa-solid fa-crown" style={{ color: "var(--color-orange)" }} />
                    </Crown>
                  )}
                </ProfileWrapper>
                <UserOverview>
                  <span>{who?.user?.name}</span>
                  <div>{who?.user?.comment}</div>
                </UserOverview>
                <ParticipateTime isFirst={true}>{GROUP_STUDY_ROLE[who.role]}</ParticipateTime>
              </MemberItem>
            ),
        )}
        {array?.map((_, idx) => (
          <MemberItem key={idx}>
            <ProfileWrapper onClick={onClickOutMember}>
              <Avatar image="" avatar={{ type: 0, bg: 0 }} size="md" isLink={false} />
            </ProfileWrapper>
            <UserOverview>
              <span>외부 참여자</span>
              <div>코멘트가 없습니다.</div>
            </UserOverview>
            <ParticipateTime isFirst={true}>멤버</ParticipateTime>
          </MemberItem>
        ))}
      </Members>
    </Layout>
  );
}

const ProfileWrapper = styled.div`
  position: relative;
`;

const Crown = styled.div`
  position: absolute;
  right: -2px;
  bottom: -2px;
`;

const MemberItem = styled.div`
  padding: var(--gap-2) 0;
  display: flex;
  align-items: center;

  border-bottom: var(--border);
`;

const Header = styled.header`
  font-size: 16px;
  padding: var(--gap-4);
  font-weight: 600;

  > span:first-child {
    margin-right: var(--gap-3);
  }
  > span:nth-child(2) {
    font-weight: 700;
    color: var(--color-mint);
  }
  > span:nth-child(3) {
    margin: 0 var(--gap-1);
  }
`;

const Members = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 var(--gap-4);
  > div:last-child {
    border: none;
  }
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
    color: var(--gray-200);
  }
`;

const ParticipateTime = styled.div<{ isFirst: boolean }>`
  font-size: 16px;
  margin-left: auto;
  margin-right: var(--gap-2);
  color: ${(props) => (props.isFirst ? "var(--color-mint)" : "var(--color-orange)")};
  > span:last-child {
    margin-left: 2px;
  }
`;

const Layout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding-bottom: var(--gap-4);
`;

export default GroupParticipation;
