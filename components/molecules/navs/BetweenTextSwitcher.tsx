import styled from "styled-components";

import ArrowTextButton from "../../atoms/buttons/ArrowTextButton";
interface IBetweenTextSwitcher {
  left: {
    text: string;
    func: () => void;
  };
  right: {
    text: string;
    func: () => void;
  };
}
export default function BetweenTextSwitcher({ left, right }: IBetweenTextSwitcher) {
  return (
    <Layout>
      <ArrowTextButton text={left.text} dir="left" onClick={left.func} size="sm" />
      <ArrowTextButton text={right.text} dir="right" onClick={right.func} size="sm" />
    </Layout>
  );
}
const Layout = styled.div`
  display: flex;
  height: 42px;
  justify-content: space-between;
  color: var(--gray-600);
  font-size: 14px;
`;
