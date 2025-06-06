import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { Input } from "../../../components/atoms/Input";
import Textarea from "../../../components/atoms/Textarea";
import BottomNav from "../../../components/layouts/BottomNav";
import Header from "../../../components/layouts/Header";
import Slide from "../../../components/layouts/PageSlide";
import ProgressStatus from "../../../components/molecules/ProgressStatus";
import { useFailToast } from "../../../hooks/custom/CustomToast";
import RegisterLayout from "../../../pageTemplates/register/RegisterLayout";
import RegisterOverview from "../../../pageTemplates/register/RegisterOverview";
import { sharedGatherWritingState } from "../../../recoils/sharedDataAtoms";

function WritingGatherContent() {
  const router = useRouter();
  const failToast = useFailToast();

  const [gatherWriting, setGatherWriting] = useRecoilState(sharedGatherWritingState);

  //초기 input 세팅
  const [title, setTitle] = useState(gatherWriting?.title || "");
  const [content, setContent] = useState(gatherWriting?.content || "");

  const onClickNext = () => {
    if (!title || !content) {
      failToast("free", "내용을 작성해 주세요!");
      return;
    }

    setGatherWriting((old) => ({
      ...old,
      title,
      content,
    }));
    router.push({ pathname: `/gather/writing/date`, query: router.query });
  };

  return (
    <>
      <Slide isFixed={true}>
        <ProgressStatus value={33} />
        <Header isSlide={false} title="" />
      </Slide>
      <RegisterLayout>
        <RegisterOverview>
          <span>어떤 활동을 하나요?</span>
          <span>자유롭게 적어주세요</span>
        </RegisterOverview>
        <Container>
          <Input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Box h="20px" />
          <Textarea
            placeholder="활동 내용을 입력해 주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minHeight={200}
          />
        </Container>
      </RegisterLayout>
      <BottomNav onClick={() => onClickNext()} />
    </>
  );
}

const Container = styled.div``;

export default WritingGatherContent;
