import { ChangeEvent } from "react";
import styled from "styled-components";

export default function PlazaBlock({ data, category }) {
  const id = data.id;

  const onSubmit = (event: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData(event.target.form);
  };
  return (
    <Layout>
      <Wrapper>
        <IconCategory category={category} />
        <Header>
          <Title>{data.title}</Title>
          <div>
            <span>{data.writer}</span>
            <span>2023-05-29</span>
          </div>
        </Header>
        <Content>{data.content}</Content>
      </Wrapper>
    </Layout>
  );
}

function IconCategory({ category }: { category: any }) {
  return <IconLayout>{category}</IconLayout>;
}

const Layout = styled.div`
  display: flex;
  flex-direction: column;

  border-bottom: 6px solid var(--font-h6);
  padding: 16px 0;
`;

const Wrapper = styled.div`
  padding: 0 16px;
`;
const Header = styled.header`
  min-height: 30px;
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin-top: 10px;
  > div {
    span {
      font-size: 10px;
      color: var(--font-h3);
      margin-left: 8px;
    }
  }
`;
const Form = styled.form`
  border-top: 1px solid var(--font-h5);
  border-bottom: 1px solid var(--font-h5);
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  width: 240px;
`;

const Content = styled.div`
  padding: 8px 0;
  color: var(--font-h2);
  font-size: 13px;
  min-height: 48px;
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;
const Main = styled.main``;

const InputItem = styled.div`
  margin-bottom: 5px;
  height: 58px;
  display: flex;
  align-items: center;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    > span {
      font-size: 8px;
    }
    > label {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;

      font-size: 14px;
      color: var(--font-h1);
      margin-bottom: 3px;
    }
  }
`;
const VoteInput = styled.input.attrs({ type: "radio" })`
  margin-right: 6px;
  width: 18px;
  height: 18px;
  color: pink;

  accent-color: #fb5d5d;
`;

const VoteFooter = styled.footer`
  display: flex;
  justify-content: flex-end;
  height: 30px;
  > span {
    display: inline-block;
    align-self: flex-end;
    margin-right: 15px;
    padding-bottom: 3px;
    font-size: 0.8em;
  }
  > button {
    width: 60px;
    background-color: pink;
    border-radius: 10px;
  }
`;
const IconLayout = styled.span`
  background-color: var(--font-h6);
  color: var(--font-h1);
  font-size: 10px;
  width: max-content;

  text-align: center;
  padding: 1px 6px;
  border-radius: 3px;
`;

const Footer = styled.footer`
  padding: 8px 16px;
  font-size: 12px;
`;

const Paritipants = styled.div`
  min-height: 40px;
`;
