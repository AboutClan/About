import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { Input } from "../../components/atoms/Input";
import Textarea from "../../components/atoms/Textarea";
import Header from "../../components/layouts/Header";
import Slide from "../../components/layouts/PageSlide";
import WritingCategory from "../../pageTemplates/square/SecretSquare/writing/WritingCategory";

function SquareWritingPage() {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm();
  const [isVote, setIsVote] = useState(true);

  const [voteList, setVoteList] = useState([]);
  const { data: session } = useSession();

  const onSubmit = (data) => {
    const writingData = {
      category: data.category,
      title: data.title,
      content: data.content,
      id: dayjs().format("hhmmss"),
      voteList,
      writer: session?.user.name,
      date: dayjs().format("YYYY-MM-DD"),
    };

    // handlePlaza(writingData);
  };
  return (
    <>
      <Header title="테스트" />
      <Slide>
        <LayoutForm onSubmit={handleSubmit(onSubmit)} id="plazaWrite">
          <WritingCategory register={register} />

          <Input placeholder="테스트" />
          <Textarea placeholder="테스트2" />
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
