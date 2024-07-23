import { Box } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

import ButtonGroups, { IButtonOptions } from "../../../components/molecules/groups/ButtonGroups";
import { SecretSquareCategory } from "../../../types/models/square";

const SECRET_SQUARE_CATEGORY: SecretSquareCategory[] = ["전체", "일상", "고민", "정보", "같이해요"];

interface SecretSquareCategoryProps {
  category: SecretSquareCategory;
  setCategory: Dispatch<SetStateAction<SecretSquareCategory>>;
}

function SecretSquareCategories({
  category: selectedCategory,
  setCategory,
}: SecretSquareCategoryProps) {
  const buttonItems: IButtonOptions[] = SECRET_SQUARE_CATEGORY.map((category) => ({
    text: `#${category}`,
    func: () => setCategory(category),
  }));

  return (
    <Box p="12px 16px">
      <ButtonGroups
        buttonItems={buttonItems}
        currentValue={`#${selectedCategory}`}
        size="sm"
        isEllipse
      />
    </Box>
  );
}

export default SecretSquareCategories;
