import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";

function ReviewCategory({
  category,
  setCategory,
}: {
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <Layout>
        <Nav>
          <Button isSelected={category === "전체"} onClick={() => setCategory("전체")}>
            전체
          </Button>
          <Button isSelected={category === "모집중"} onClick={() => setCategory("모집중")}>
            모집중
          </Button>
          <Button isSelected={category === "완료"} onClick={() => setCategory("완료")}>
            완료
          </Button>
        </Nav>
      </Layout>
    </>
  );
}

const Layout = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-300);
  justify-content: space-between;
  padding: 4px 18px;
`;

const Nav = styled.nav``;

const Button = styled.button<{ isSelected: boolean }>`
  padding: 3px 10px;
  border: 1.5px solid var(--gray-300);
  border-radius: 12px;
  margin-right: 12px;
  color: ${(props) => (props.isSelected ? "white" : "var(--gray-700)")};
  font-size: 13px;
  background-color: ${(props) => (props.isSelected ? "var(--color-mint)" : null)};
`;

export default ReviewCategory;
