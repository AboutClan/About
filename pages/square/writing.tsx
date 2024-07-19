import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { FormEventHandler, useRef, useState } from "react";
import styled from "styled-components";

import { Input } from "../../components/atoms/Input";
import Textarea from "../../components/atoms/Textarea";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import WritingCategory from "../../pageTemplates/square/SecretSquare/writing/WritingCategory";
import { SquareType } from "../../types/models/square";

function SquareWritingPage() {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const categoryRef = useRef("일상");
  const [squareType, setSquareType] = useState<SquareType>("general");

  const { data: session } = useSession();

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    // const writingData = {
    //   category: data.category,
    //   title: data.title,
    //   content: data.content,
    //   id: dayjs().format("hhmmss"),
    //   voteList: [],
    //   writer: session?.user.name,
    //   date: dayjs().format("YYYY-MM-DD"),
    // };

    // 유효성 검사
  };

  const selectCategory = (value: string) => {
    categoryRef.current = value;
  };

  return (
    <>
      <Header title="글 작성하기" />
      <Slide>
        <LayoutForm onSubmit={onSubmit} id="plazaWrite">
          <WritingCategory selectCategory={selectCategory} />

          <Input name="title" minLength={3} placeholder="제목을 입력해주세요" ref={titleRef} />
          <Textarea
            name="content"
            minLength={10}
            placeholder="본문을 입력해주세요"
            ref={contentRef}
          />
          {/* TODO 사진, 투표 creator modal */}
          {/* TODO design submit button */}
          <Button type="submit">완료</Button>
        </LayoutForm>
      </Slide>
    </>
  );
}

const Layout = styled(motion.div)``;

const LayoutForm = styled.form`
  padding: 0 16px;
`;

const TitleInput = styled.input`
  width: 100%;
  margin-top: 16px;
  height: 44px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid var(--font-h6);
  background-color: var(--font-h8);
  color: var(--font-h2);
  ::placeholder {
    font-size: 16px;
    font-weight: 600;
    color: var(--font-h4);
  }
`;

export default SquareWritingPage;
