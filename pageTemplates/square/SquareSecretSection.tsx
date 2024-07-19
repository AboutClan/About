import { Box } from "@chakra-ui/react";
import { useState } from "react";

import WritingIcon from "../../components/atoms/Icons/WritingIcon";
import { usePlazaQuery } from "../../hooks/sub/plaza/queries";
import { SecretSquareCategory as Category, type SecretSquareItem } from "../../types/models/square";
import PlazaBlock from "./SecretSquare/PlazaBlock";
import SecretSquareCategory from "./SecretSquare/SecretSquareCategory";

export const SECRET_SQUARE_CATEGORY: Category[] = ["전체", "일상", "고민", "정보", "같이해요"];

function SquareSecretSection() {
  const [category, setCategory] = useState<Category>("전체");

  const temp: SecretSquareItem[] = [
    {
      category: "전체",
      title: "테스트",
      content:
        "테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.",
      id: "34",
      type: "general",
      author: "이승주",
      createdAt: "2023-05-29",
      viewCount: 10,
    },
    {
      category: "일상",
      title: "테스트",
      content:
        "테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.",
      id: "35",
      type: "poll",
      author: "이승주",
      createdAt: "2023-05-30",
      viewCount: 124,
      pollList: [
        { id: "0", value: "떡볶이", count: 3 },
        { id: "1", value: "마라탕", count: 3 },
        { id: "2", value: "연어", count: 3 },
        { id: "3", value: "대창", count: 3 },
      ],
    },
  ];
  const { data: squareList } = usePlazaQuery();
  return (
    <>
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

export default SquareSecretSection;
