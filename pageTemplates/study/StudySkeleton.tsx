import styled from "styled-components";

import StudyTimeTableSkeleton from "./studySkeleton/studyTimeTableSkeleton";

interface IstudySkeleton {
  coverImageUrl: string;
}

function studySkeleton({ coverImageUrl }: IstudySkeleton) {
  return (
    <Layout>
      <StudyHeaderSkeleton />
      <Wrapper>
        <StudyCoverSkeleton coverImageUrl={coverImageUrl} />
        <StudyOverviewSkeleton />
        <HrDiv />
        <studyVoteOverviewSkeleton />
        <StudyTimeTableSkeleton />
      </Wrapper>
    </Layout>
  );
}

const Layout = styled.div``;

const Wrapper = styled.div``;
const HrDiv = styled.div`
  height: 1px;
  background-color: var(--font-h56);
`;

export default studySkeleton;
