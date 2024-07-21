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
      <Nav>
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
                    <CategoryRadio value={category}>{category}</CategoryRadio>
                  </Fragment>
                );
              })}
            </RadioGroup>
          )}
        />
      </Nav>
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

const Nav = styled.ul`
  display: flex;
  align-items: center;
  padding: 16px 0;
`;

const CategoryRadio = styled(Radio)`
  margin-right: 3px;
  accent-color: #fb5d5d;
`;

export default SquareCategoryRadioGroup;
