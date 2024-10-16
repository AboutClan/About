import styled from "styled-components";

import { IProfileCommentCard } from "../../../components/molecules/cards/ProfileCommentCard";
import ProfileCardColumn from "../../../components/organisms/ProfileCardColumn";
import { GROUP_STUDY_ROLE } from "../../../constants/settingValue/groupStudy";
import { IGroup } from "../../../types/models/groupTypes/group";

interface IGroupParticipation {
  data: IGroup;
}

function GroupParticipation({ data }: IGroupParticipation) {
  const participantsCnt = data.participants.length;

  const isSecret = data?.isSecret;

  const userCardArr: IProfileCommentCard[] = data.participants.map((par) => {
    if (isSecret) {
      return {
        user: null,
        comment: { text: "익명으로 진행되는 소모임입니다." },
        rightComponent: <ParticipateTime isFirst={true}>비공개</ParticipateTime>,
      };
    }
    return {
      user: par.user,
      comment: { text: par.user?.comment || "비공개 계정입니다." },
      rightComponent: (
        <>
          <ParticipateTime isFirst={true}>{GROUP_STUDY_ROLE[par.role]}</ParticipateTime>
        </>
      ),
    };
  });

  return (
    <Layout>
      <Header>
        <span>참여중인 인원</span>
        <span>{participantsCnt}</span>
        <span>/</span>
        {data?.memberCnt.max ? (
          <span>{data?.memberCnt.max}</span>
        ) : (
          <>
            <span style={{ marginLeft: "4px" }} />
            <i className="fa-solid fa-infinity" style={{ color: "var(--gray-400)" }} />
          </>
        )}
      </Header>
      <ProfileCardColumn hasCommentButton={false} userCardArr={userCardArr} />
    </Layout>
  );
}

const Header = styled.header`
  font-size: 16px;
  padding: var(--gap-4) 0;
  font-weight: 600;

  > span:first-child {
    margin-right: var(--gap-4);
  }
  > span:nth-child(2) {
    font-weight: 700;
    color: var(--color-mint);
  }
  > span:nth-child(3) {
    margin: 0 var(--gap-1);
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
  padding: 0 20px;
  padding-bottom: var(--gap-4);
`;

export default GroupParticipation;
