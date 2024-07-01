import { useRouter } from "next/router";
import styled from "styled-components";

interface IPointScoreNavigation {
  myScore: number;
}

function PointScoreNavigation({ myScore }: IPointScoreNavigation) {
  const router = useRouter();

  return (
    <>
      <Layout>
        <Button onClick={() => router.push("/point/scoreLog")}>
          <div>About 점수</div>
          <div>
            <span>{myScore || 0}점</span>
            <i className="fa-solid fa-chevron-right fa-xs" />
          </div>
        </Button>
        <Button onClick={() => router.push("/ranking")}>
          <div>About 랭킹</div>
          <div>
            <i className="fa-solid fa-chevron-right fa-xs" />
          </div>
        </Button>
      </Layout>
    </>
  );
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  padding: var(--gap-3) var(--gap-2);
  > div:first-child {
    font-size: 14px;
  }
  > div:last-child {
    display: flex;
    align-items: center;
    > span:first-child {
      margin-right: var(--gap-2);
    }
  }
`;

export default PointScoreNavigation;
