import { useEffect, useState } from "react";
import styled from "styled-components";

import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import { useNoticeActiveLogQuery } from "../../hooks/user/sub/interaction/queries";
import NoticeActive from "../../pageTemplates/notice/NoticeActive";
import NoticeItem from "../../pageTemplates/notice/NoticeItem";
import NoticeNav from "../../pageTemplates/notice/NoticeNav";

function Notice() {
  const [isNotice, setIsNotice] = useState(true);
  const { data: activeLogs } = useNoticeActiveLogQuery();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [isNotice]);

  return (
    <>
      <Slide isFixed={true}>
        <Header title="공지" isSlide={false} />
        <NoticeNav
          isNotice={isNotice}
          setIsNotice={setIsNotice}
          activeAlertCnt={activeLogs?.length}
        />
      </Slide>
      <Slide>
        <Layout>
          <Container>
            {isNotice ? <NoticeItem /> : <NoticeActive activeLogs={activeLogs} />}
          </Container>
        </Layout>
      </Slide>
    </>
  );
}

const Layout = styled.div`
  margin-top: 58px;
  background-color: white;
`;

const Container = styled.div`
  color: var(--gray-900);
  display: flex;
  flex-direction: column;
  margin-top: var(--gap-2);
`;

export default Notice;
