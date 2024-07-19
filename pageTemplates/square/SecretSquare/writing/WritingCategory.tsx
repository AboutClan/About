import { Fragment } from "react";
import styled from "styled-components";

const categories = ["일상", "고민", "정보", "같이해요"] as const;

interface WritingCategoryProps {
  selectCategory: (value: string) => void;
}

function WritingCategory({ selectCategory }: WritingCategoryProps) {
  return (
    <>
      <Layout>
        <Header>분야</Header>
        <Nav>
          {categories.map((category) => {
            return (
              <Fragment key={category}>
                <CategoryInput
                  type="radio"
                  name="category"
                  value={category}
                  defaultChecked={category === "일상"}
                  id={category}
                  ref={(el) => {
                    if (el) {
                      selectCategory(el.value);
                    }
                  }}
                />
                <Label htmlFor={category}>{category}</Label>
              </Fragment>
            );
          })}
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

const Nav = styled.ul`
  display: flex;
  align-items: center;
  padding: 16px 0;
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
