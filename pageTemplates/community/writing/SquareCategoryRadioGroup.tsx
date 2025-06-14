import { Flex, Radio, RadioGroup } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

import { type SecretSquareCategory } from "../../../types/models/square";

const SECRET_SQUARE_CATEGORY: SecretSquareCategory[] = ["일상", "질문", "고민", "기타"];

function SquareCategoryRadioGroup() {
  const { control } = useFormContext();
  return (
    <Layout>
      <Flex as="ul" align="center" pb={4}>
        <Controller
          name="category"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <RadioGroup {...field} as={Flex} ml="4px">
              {SECRET_SQUARE_CATEGORY.map((category) => (
                <Radio mr="16px" key={category} colorScheme="mint" value={category} size="sm">
                  {category}
                </Radio>
              ))}
            </RadioGroup>
          )}
        />
      </Flex>
    </Layout>
  );
}

const Layout = styled.div`
  margin-top: 16px;
`;

export default SquareCategoryRadioGroup;
