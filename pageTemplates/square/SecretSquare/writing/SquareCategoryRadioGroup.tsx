import { Flex, Radio, RadioGroup } from "@chakra-ui/react";
import { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";

const categories = ["일상", "고민", "정보", "같이해요"] as const;

function SquareCategoryRadioGroup() {
  const { control } = useFormContext();
  return (
    <Layout>
      <Header>주제</Header>
      <Flex as="ul" align="center" pb={4}>
        <Controller
          name="category"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <RadioGroup {...field} as={Flex} justifyContent="space-between" w="100%">
              {categories.map((category) => {
                return (
                  <Fragment key={category}>
                    <Radio colorScheme="mintTheme" value={category}>
                      {category}
                    </Radio>
                  </Fragment>
                );
              })}
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

const Header = styled.header`
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--font-h2);
`;

export default SquareCategoryRadioGroup;
