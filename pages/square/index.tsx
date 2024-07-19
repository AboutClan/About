import { Box } from "@chakra-ui/react";
import { useState } from "react";
import WritingIcon from "../../components/atoms/Icons/WritingIcon";

import Header from "../../components/layouts/Header";
import { usePlazaQuery } from "../../hooks/sub/plaza/queries";
import PlazaBlock from "../../pageTemplates/square/main/PlazaBlock";
import SecretSquareCategory from "../../pageTemplates/square/SecretSquare/SecretSquareCategory";
import SquareTabNav, { SquareTab } from "../../pageTemplates/square/SquareTabNav";
import { SecretSquareCategory as Category } from "../../types/models/square";

export const SECRET_SQUARE_CATEGORY: Category[] = ["전체", "일상", "고민", "정보", "같이해요"];

function SquarePage() {
  const [tab, setTab] = useState<SquareTab>("시크릿 스퀘어");
  const [category, setCategory] = useState<Category>("전체");

  const temp = [
    {
      category: "전체",
      title: "테스트",
      content: "테스트용 게시글입니다.",
      id: "34",
      writer: "이승주",
      date: "2023-05-29",
    },
    {
      category: "일상",
      title: "테스트",
      content: "테스트용 게시글입니다.",
      id: "35",
      writer: "이승주",
      date: "2023-05-30",
      voteList: [
        { voteListIdx: 0, value: "떡볶이" },
        { voteListIdx: 1, value: "마라탕" },
        { voteListIdx: 2, value: "연어" },
        { voteListIdx: 3, value: "대창" },
      ],
    },
  ];
  const { data } = usePlazaQuery();

  return (
    <>
      <Header title="어바웃 스퀘어" isBack={false} />
      <SquareTabNav tab={tab} setTab={setTab} />
      <SecretSquareCategory category={category} setCategory={setCategory} />
      <Box>
        {temp.map((data, idx) => (
          <PlazaBlock key={idx} data={data} category={category} />
        ))}
      </Box>

      <WritingIcon url="/square/writing" />
    </>
  );
}

export default SquarePage;
