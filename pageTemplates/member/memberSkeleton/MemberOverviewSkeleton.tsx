import { useRouter } from "next/router";
import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";
import { Location } from "../../../types/services/locationTypes";
function MemberOverviewSkeleton() {
  const router = useRouter();
  const location = router.query.location;

  return (
    <Layout>
      <Title>
        <Skeleton>스터디</Skeleton>
      </Title>
      <Info>
        <li>
          <span>개설 날짜</span>
          <span>
            <Skeleton>temp</Skeleton>
          </span>
        </li>
        <li>
          <span>전체 멤버</span>
          <span>
            <Skeleton>temp</Skeleton>
          </span>
        </li>
        <li>
          <span>활동 멤버</span>
          <span>
            <Skeleton>temp</Skeleton>
          </span>
        </li>
        <ActiveLocation location={location as Location}>
          <span>활동 장소</span>
          <Studys location={location as Location}>
            <Skeleton>temp</Skeleton>
          </Studys>
        </ActiveLocation>
      </Info>
    </Layout>
  );
}

const Layout = styled.div`
  padding: var(--gap-2) 0;
  margin: 0 var(--gap-4);
`;
const Title = styled.div`
  width: 75px;
  font-weight: 600;
`;

const Info = styled.div`
  font-size: 12px;
  margin-top: var(--gap-2);
  line-height: 2;
  > li {
    display: flex;
    margin-left: -2px;
    list-style-type: none;

    > span:first-child {
      margin-right: var(--gap-2);
      font-weight: 600;
      color: var(--gray-900);
    }
    > span:last-child {
      display: inline-block;
      height: 20px;
    }
  }
  > li::before {
    content: "•";
    font-size: 10px;
    padding-right: var(--gap-1);
  }
`;

const ActiveLocation = styled.li<{ location: Location }>`
  height: ${(props) =>
    props.location === "수원" ? "74px" : props.location !== "안양" ? "48px" : "24px"};
`;

const Studys = styled.div<{ location: Location }>`
  flex: 1;

  color: var(--gray-2);
  margin-top: 4px;
  height: ${(props) =>
    props.location === "수원" ? "72px" : props.location !== "안양" ? "40px" : "20px"};

  > span {
    margin-right: var(--gap-1);
  }
`;

export default MemberOverviewSkeleton;
