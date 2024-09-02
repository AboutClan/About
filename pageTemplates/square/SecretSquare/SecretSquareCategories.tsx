import { Box } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

import ButtonGroups, {
  ButtonOptionsProps,
} from "../../../components/molecules/groups/ButtonGroups";
import { type SecretSquareCategoryWithAll } from "../../../types/models/square";

const SECRET_SQUARE_CATEGORY: SecretSquareCategoryWithAll[] = [
  "전체",
  "일상",
  "정보",
  "같이해요",
  "고민",
];

interface SecretSquareCategoryProps {
  category: SecretSquareCategoryWithAll;
  setCategory: Dispatch<SetStateAction<SecretSquareCategoryWithAll>>;
}

function SecretSquareCategories({
  category: selectedCategory,
  setCategory,
}: SecretSquareCategoryProps) {
  const buttonOptionsArr: ButtonOptionsProps[] = SECRET_SQUARE_CATEGORY.map((category) => ({
    text: `#${category}`,
    func: () => setCategory(category),
  }));

  return (
    <Box p="12px 16px">
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
