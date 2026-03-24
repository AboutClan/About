import { Box, Flex, Radio, RadioGroup } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { CATEGORY_ARR } from "../../../pages/community";

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
          render={({ field: { onChange, value } }) => (
            <RadioGroup as={Flex} ml="4px" value={value} onChange={onChange} lineHeight="20px">
              {CATEGORY_ARR.slice(1).map((category) => (
                <Radio mr={3} key={category} colorScheme="mint" value={category} size="sm">
                  <Box fontSize="13px" color="gray.800">
                    {category}
                  </Box>
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
