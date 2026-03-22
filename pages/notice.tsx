import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Header from "../components/layouts/Header";
import Slide from "../components/layouts/PageSlide";
import { useCheckGuest } from "../hooks/custom/UserHooks";
import { useNoticeActiveLogQuery } from "../hooks/user/sub/interaction/queries";
import NoticeActive from "../pageTemplates/notice/NoticeActive";
import NoticeItem from "../pageTemplates/notice/NoticeItem";
import NoticeNav from "../pageTemplates/notice/NoticeNav";

export type NoticeType = "notice" | "active";

function Notice() {
  const isGuest = useCheckGuest();
  const router = useRouter();
  const type = router.query.type as NoticeType;

  const [noticeType, setNoticeType] = useState<NoticeType>("notice");

  const { data: activeLogs } = useNoticeActiveLogQuery(null, false, {
    enabled: isGuest === false,
  });

  useEffect(() => {
    if (!type) router.replace(`/notice?type=notice`);
    setNoticeType(type);
  }, [type]);

  return (
    <>
      <Slide isFixed={true}>
        <Header title="알림" isSlide={false} />
        <NoticeNav noticeType={noticeType} setNoticeType={setNoticeType} activeLogs={activeLogs} />
      </Slide>
      <Slide isNoPadding>
        <Container>
          {noticeType === "notice" ? <NoticeItem /> : <NoticeActive activeLogs={activeLogs} />}
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
