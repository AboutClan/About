import { Flex, Radio, RadioGroup } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

const categories = ["일상", "취미", "정보", "같이해요"] as const;

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
              {categories.map((category) => (
                <Radio mr="16px" key={category} colorScheme="mintTheme" value={category} size="sm">
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
