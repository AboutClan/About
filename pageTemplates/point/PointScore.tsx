import styled from "styled-components";

import PointScoreBar from "./pointScore/PointScoreBar";
import PointScoreNavigation from "./pointScore/PointScoreNavigation";

interface IPointScore {
  myScore: number;
}

function PointScore({ myScore }: IPointScore) {
  return (
    <Layout>
      <PointScoreBar myScore={myScore} />
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
