import { Box } from "@chakra-ui/react";
import { useState } from "react";

import WritingIcon from "../../components/atoms/Icons/WritingIcon";
import { SecretSquareCategory as Category } from "../../types/models/square";
import SecretSquareCategory from "./SecretSquare/SecretSquareCategory";

export const SECRET_SQUARE_CATEGORY: Category[] = ["전체", "일상", "고민", "정보", "같이해요"];

function SquareSecretSection() {
  const [category, setCategory] = useState<Category>("전체");

  return (
    <>
      <SecretSquareCategory category={category} setCategory={setCategory} />
      <Box></Box>
      <WritingIcon url="/square/writing" />
    </>
  );
}

export default SquareSecretSection;
