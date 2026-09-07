import { useSession } from "next-auth/react";
import styled from "styled-components";

import Header from "@/components/layouts/Header";
import PointIntro from "@/features/point/screens/PointIntro";
import PointPoint from "@/features/point/screens/PointPoint";
import PointScore from "@/features/point/screens/PointScore";
import PointSkeleton from "@/features/point/screens/skeleton/PointSkeleton";
import { useUserInfoQuery } from "@/hooks/user/queries";

function Point() {
  const { data: session } = useSession();
  const isGuest = session?.user.role === "guest";
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
