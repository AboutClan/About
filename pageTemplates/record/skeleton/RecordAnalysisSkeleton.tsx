import styled from "styled-components";

import Skeleton from "../../../components/atoms/skeleton/Skeleton";

function RecordAnalysisSkeleton() {
  return (
    <>
      <Layout>
        {new Array(6).fill(0).map((_, idx) => (
          <Block key={idx}>
            <Date>
              <span>
                <Skeleton>temp</Skeleton>
              </span>
            </Date>
            <SpaceWrapper>
              <Info>
                <span>
                  <Skeleton>temp</Skeleton>
                </span>
                <span>
                  <Skeleton>temp</Skeleton>
                </span>
              </Info>
              <Member></Member>
            </SpaceWrapper>
          </Block>
        ))}
      </Layout>
    </>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-4);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Block = styled.div``;
const Date = styled.div`
  padding: var(--gap-1) var(--gap-4);
  font-weight: 600;
  font-size: 12px;
  background-color: var(--gray-7);
  > span {
    display: inline-block;
    width: 64px;
  }
`;

const SpaceWrapper = styled.div`
  padding: var(--gap-4);

  font-size: 12px;
  color: var(--gray-2);
`;

const Info = styled.div`
  display: flex;
  align-items: flex-end;
  color: var(--gray-2);
  font-size: 14px;
  > span:first-child {
    height: 21px;
    display: inline-block;
    width: 60px;
    margin-right: var(--gap-3);
  }
  > span:last-child {
    display: inline-block;
    width: 72px;
    height: 18px;
  }
`;

const Member = styled.div`
  height: 48px;
`;
export default RecordAnalysisSkeleton;
