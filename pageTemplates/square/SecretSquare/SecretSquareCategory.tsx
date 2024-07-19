import { Box } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import ButtonGroups, { IButtonOptions } from "../../../components/molecules/groups/ButtonGroups";
import { SECRET_SQUARE_CATEGORY } from "../../../pages/square";
import { SecretSquareCategory } from "../../../types/models/square";

interface SecretSquareCategoryProps {
  category: SecretSquareCategory;
  setCategory: Dispatch<SetStateAction<SecretSquareCategory>>;
}

function SecretSquareCategory({
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

export default SecretSquareCategory;
