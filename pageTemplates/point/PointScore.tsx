import styled from "styled-components";

import PointScoreNavigation from "./pointScore/PointScoreNavigation";

interface IPointScore {
  myScore: number;
}

function PointScore({ myScore }: IPointScore) {
  return (
    <Layout>
      {/* <PointScoreBar /> */}
      <PointScoreNavigation myScore={myScore} />
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--gap-4);
  border-radius: var(--rounded-lg);
  background-color: white;
`;

export default PointScore;
