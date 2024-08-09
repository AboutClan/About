import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

import { MainLoadingAbsolute } from "../../components/atoms/loaders/MainLoading";
import { useSecretSquareListQuery } from "../../hooks/secretSquare/queries";
import { type SecretSquareCategoryWithAll } from "../../types/models/square";
import SecretSquareCategories from "./SecretSquare/SecretSquareCategories";
import SquareItem from "./SecretSquare/SquareItem";

function SquareSecretSection() {
  const [category, setCategory] = useState<SecretSquareCategoryWithAll>("전체");
  const { data, isLoading } = useSecretSquareListQuery({ category });

  return (
    <>
      <SecretSquareCategories category={category} setCategory={setCategory} />

      <Box>
        {data &&
          (data.squareList.length === 0 ? (
            <Flex fontSize="18px" height="200px" justify="center" align="center">
              가장 먼저 &ldquo;{category}&rdquo; 카테고리에 글을 남겨보세요!
            </Flex>
          ) : (
            <>
              {data.squareList.map((squareItem) => (
                <SquareItem key={squareItem._id} item={squareItem} />
              ))}
            </>
          ))}

        {isLoading && (
          <Box position="relative" mt="32px" mb="40px">
            <MainLoadingAbsolute size="sm" />
          </Box>
        )}
      </Box>
    </>
  );
}

export default SquareSecretSection;
