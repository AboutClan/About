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
  justify-content: space-between;
  padding: 1rem 1rem 0; /* px-4 pt-4 */
  color: #4a5568; /* Assuming text-gray-2 maps to a specific gray, adjust as necessary */
`;
