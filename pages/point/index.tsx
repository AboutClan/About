import { useSession } from "next-auth/react";
import styled from "styled-components";

import Header from "../../components/layouts/Header";
import { useUserInfoQuery } from "../../hooks/user/queries";
import PointIntro from "../../pageTemplates/point/PointIntro";
import PointPoint from "../../pageTemplates/point/PointPoint";
import PointScore from "../../pageTemplates/point/PointScore";
import PointSkeleton from "../../pageTemplates/point/skeleton/PointSkeleton";

function Point() {
  const { data: session } = useSession();
  const isGuest = session?.user.name === "guest";
  const { data: userInfo } = useUserInfoQuery({
    enabled: !isGuest,
  });

  return (
    <>
      <Header title="" />
      <Layout>
        <PointIntro />
        {userInfo || isGuest ? (
          <Container>
            <PointScore myScore={userInfo?.score || 0} />
            <PointPoint mypoint={userInfo?.point || 0} />
          </Container>
        ) : (
          <PointSkeleton />
        )}
      </Layout>
    </>
  );
}

const Layout = styled.div`
  background-color: var(--gray-100);
  margin: 0 var(--gap-4);
  margin-top: var(--gap-3);
`;

const Container = styled.div``;

export default Point;
