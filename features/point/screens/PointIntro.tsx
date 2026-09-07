import { useSession } from "next-auth/react";
import styled from "styled-components";

function PointIntro() {
  const { data: session } = useSession();

  return (
    <Layout>
      <span>{session?.user.name}</span>님 만나서 반가워요!
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: var(--gap-2);
  margin-bottom: var(--gap-5);
  margin-left: var(--gap-1);
  font-size: 16px;
  color: var(--gray-600);
  > span {
    color: var(--gray-800);
    font-size: 18px;
    font-weight: 600;
  }
`;

export default PointIntro;
