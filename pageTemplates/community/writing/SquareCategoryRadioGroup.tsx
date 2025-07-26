import { Flex, Radio, RadioGroup } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

import { InfoSquareCategory, type SecretSquareCategory } from "../../../types/models/square";

const SECRET_SQUARE_CATEGORY: SecretSquareCategory[] = ["일상", "질문", "고민", "기타"];
const INFO_SQUARE_CATEOGRY: InfoSquareCategory[] = ["정보", "팀원 모집", "홍보", "기타"];

function SquareCategoryRadioGroup({ type }: { type: "secret" | "info" }) {
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
          render={({ field: { onChange, value } }) => (
            <RadioGroup as={Flex} ml="4px" value={value} onChange={onChange}>
              {(type === "secret" ? SECRET_SQUARE_CATEGORY : INFO_SQUARE_CATEOGRY).map(
                (category) => (
                  <Radio mr="16px" key={category} colorScheme="mint" value={category} size="sm">
                    {category}
                  </Radio>
                ),
              )}
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
