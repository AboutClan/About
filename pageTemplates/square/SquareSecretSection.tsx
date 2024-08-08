import { Box } from "@chakra-ui/react";
import { useState } from "react";

import BlurredPart from "../../components/molecules/BlurredPart";
import { type SecretSquareCategory, type SecretSquareItem } from "../../types/models/square";
import SecretSquareCategories from "./SecretSquare/SecretSquareCategories";
import SquareItem from "./SecretSquare/SquareItem";

export const SECRET_SQUARE_CATEGORY: SecretSquareCategory[] = [
  "전체",
  "일상",
  "고민",
  "정보",
  "같이해요",
];

// TODO it's just temp type
type SecretSquareResponse = Omit<SecretSquareItem, "comments" | "images"> & {
  thumbnail: string;
  commentsCount: number;
};

function SquareSecretSection() {
  const [category, setCategory] = useState<SecretSquareCategory>("전체");
  // TODO GET /square

  const temp: SecretSquareResponse[] = [
    {
      category: "전체",
      title: "테스트",
      content: "테스트로 만들어진 게시글입니다!",
      id: "34",
      type: "general",
      createdAt: "2024-07-24",
      viewCount: 10,
      likeCount: 123,
      commentsCount: 12,
      thumbnail:
        "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      category: "일상",
      title: "테스트로 만든 게시글",
      content:
        "테스트용 게시글입니다.테스트용  게시글입니다스트용 게시글입니다.테스트용 게시글입니다.테스트용 게시글입니다.",
      id: "35",
      type: "poll",
      createdAt: "2024-07-22",
      viewCount: 53234,
      likeCount: 123,
      commentsCount: 12,
      thumbnail:
        "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      category: "일상",
      title: "테스트로 만든 게시글입니다다다다ㅏ",
      content:
        "테스트용 게시글입니다.테스트용  게글입니다스트용 게시시글입니다.테스트용 게시글입니다.테시시글입니다.테스트용 게스트용 게시글입니다.",
      id: "35",
      type: "poll",
      createdAt: "2024-07-22",
      viewCount: 53234,
      likeCount: 123,
      commentsCount: 12,
      thumbnail:
        "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <>
      <SecretSquareCategories category={category} setCategory={setCategory} />
      <BlurredPart isBlur text="8월 5일 오픈 예정" size="lg">
        <Box>
          {temp.map((item) => (
            <SquareItem key={item.id} item={item} />
          ))}
        </Box>
      </BlurredPart>
    </>
  );
}

export default SquareSecretSection;
