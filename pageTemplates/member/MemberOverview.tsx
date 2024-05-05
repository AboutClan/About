import { useRouter } from "next/router";
import styled from "styled-components";

import { MemberGroup } from "../../types/models/member";
import { IUser } from "../../types/models/userTypes/userInfoTypes";
import { Location } from "../../types/services/locationTypes";
import { birthToAge } from "../../utils/convertUtils/convertTypes";
interface IMemberOverview {
  onClickSection: (section: MemberGroup) => void;
  groups: IUser[][];
}

function MemberOverview({ groups, onClickSection }: IMemberOverview) {
  const router = useRouter();
  const location = router.query.location;

  const locationName =
    (location as Location) === "동대문"
      ? "동대문구/성북구"
      : (location as Location) === "양천"
        ? "양천구/영등포구"
        : location;

  const type = ["A", "B", "C", "D", "E", "F"];

  return (
    <Layout>
      <Title>소그룹 구성</Title>
      <Container>
        {groups?.map((item, idx) => {
          if (!item) return null;
          let min = 100;
          let max = 0;
          item.forEach((who) => {
            const age = birthToAge(who?.birth);
            if (age > max) max = age;
            if (age < min) min = age;
          });

          return (
            <GroupLayout
              key={idx}
              onClick={() => onClickSection(`group${type[idx]}` as MemberGroup)}
            >
              <GroupTitle>
                {locationName} 그룹 {type[idx]}
              </GroupTitle>
              <GroupInfo>
                <InfoItem>
                  <span>그룹장</span>
                  <span>
                    {item?.find((who) => who.role === "manager" || who.role === "previliged")?.name}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span>인원</span>
                  <span>{item?.length}명</span>
                </InfoItem>
                <InfoItem>
                  <span>나이</span>
                  <span>
                    만 {min}~{max}세
                  </span>
                </InfoItem>
              </GroupInfo>
              <MemberTitle>멤버</MemberTitle>
              <GroupMembers>
                {item?.map((user, idx2) =>
                  idx2 < 13 ? (
                    <ProfileContainer key={user.uid} zIndex={idx2}>
                      temp
                    </ProfileContainer>
                  ) : null,
                )}
              </GroupMembers>
            </GroupLayout>
          );
        })}
      </Container>
    </Layout>
  );
}
const MemberTitle = styled.div`
  color: var(--gray-2);
  margin-bottom: 12px;
  font-size: 13px;
`;

const ProfileContainer = styled.div<{ zIndex: number }>`
  width: 23px;
  display: flex;
  z-index: ${(props) => props.zIndex};
  position: relative;
`;
const Container = styled.div``;

const GroupLayout = styled.button`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: var(--rounded);
  box-shadow: var(--shadow);
  padding: var(--gap-3);
  margin-bottom: var(--gap-4);
  box-shadow: var(--shadow);
`;
const GroupTitle = styled.div`
  font-weight: 600;
  font-size: 15px;
`;
const GroupInfo = styled.div`
  width: 100%;
  margin-bottom: 8px;
  padding: var(--gap-3) 0;

  display: grid;
  grid-template-columns: 1.2fr 1fr 1.5fr;
  gap: var(--gap-1);
  border-bottom: var(--border);
`;
const InfoItem = styled.div`
  text-align: start;
  font-size: 13px;
  > span:first-child {
    display: inline-block;
    margin-right: var(--gap-2);
    font-weight: 600;
    color: var(--gray-2);
  }
  > span:last-child {
    color: var(--gray-3);
  }
`;

const GroupMembers = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  padding: 12px 0;
  align-items: end;
`;

const Layout = styled.div`
  margin: 0 var(--gap-4);
`;

const Title = styled.div`
  padding: 16px 0;
  font-size: 18px;
  font-weight: 600;
`;

export default MemberOverview;
