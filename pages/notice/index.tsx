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
        <Header title="알림" isSlide={false} />
        <NoticeNav
          isNotice={isNotice}
          setIsNotice={setIsNotice}
          activeAlertCnt={activeLogs?.length}
        />
      </Slide>
      <Slide>
        <Container>
          {isNotice ? <NoticeItem /> : <NoticeActive activeLogs={activeLogs} />}
        </Container>
      </Slide>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 56px;
  background-color: white;
`;

export default Notice;
