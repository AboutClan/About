import { FieldValues, UseFormRegister } from "react-hook-form";
import styled from "styled-components";

function WritingCategory({
  register,
}: {
  register: UseFormRegister<FieldValues>;
}) {
  return (
    <>
      <Layout>
        <Header>분야</Header>
        <Nav>
          <CategoryInput
            type="radio"
            name="category"
            value="일상"
            defaultChecked
            id="일상"
            {...register("category")}
          />
          <Label htmlFor="일상">일상</Label>
          <CategoryInput
            type="radio"
            name="category"
            value="고민"
            id="고민"
            {...register("category")}
          />
          <Label htmlFor="고민">고민</Label>
          <CategoryInput
            type="radio"
            name="category"
            value="정보"
            id="정보"
            {...register("category")}
          />
          <Label htmlFor="정보">정보</Label>
          <CategoryInput
            type="radio"
            name="category"
            value="같이해요"
            id="같이해요"
            {...register("category")}
          />
          <Label htmlFor="같이해요">같이해요</Label>
        </Nav>
      </Layout>
    </>
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

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  color: var(--font-h3);
  margin-right: 12px;
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
`;

const CategoryInput = styled.input`
  margin-right: 3px;
  accent-color: #fb5d5d;
`;

export default WritingCategory;
