import { Box } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

import ButtonGroups, { ButtonOptionsProps } from "../../components/molecules/groups/ButtonGroups";
import {
  InfoSquareCategoryWithAll,
  type SecretSquareCategoryWithAll,
} from "../../types/models/square";

const SECRET_SQUARE_CATEGORY: SecretSquareCategoryWithAll[] = [
  "전체",
  "일상",
  "고민",
  "질문",
  "기타",
];
const INFO_SQUARE_CATEGORY: InfoSquareCategoryWithAll[] = [
  "전체",
  "팀원 모집",
  "정보",
  "홍보",
  "기타",
];

interface SecretSquareCategoryProps {
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  type: "secret" | "info";
}

function SecretSquareCategories({
  category: selectedCategory,
  setCategory,
  type,
}: SecretSquareCategoryProps) {
  const buttonOptionsArr: ButtonOptionsProps[] = (
    type === "secret" ? SECRET_SQUARE_CATEGORY : INFO_SQUARE_CATEGORY
  ).map((category) => ({
    text: `#${category}`,
    func: () => setCategory(category),
  }));

  return (
    <Box py={3} px={5}>
      <ButtonGroups
        buttonOptionsArr={buttonOptionsArr}
        currentValue={`#${selectedCategory}`}
        size="sm"
        isEllipse
      />
    </Box>
  );
}

export default SecretSquareCategories;
