import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { prevPageUrlState } from "../../../recoils/previousAtoms";

interface ISectionHeader {
  title: string;
  subTitle?: string;
  url: string;
}

function SectionHeader({ title, url }: ISectionHeader) {
  const router = useRouter();
  const setPrevPageUrl = useSetRecoilState(prevPageUrlState);

  const onClick = () => {
    setPrevPageUrl("/home");
    router.push(url);
  };
  return (
    <Layout>
      <Title>{title}</Title>
      <ShowAllBtn onClick={onClick}>더보기</ShowAllBtn>
    </Layout>
  );
}

const Layout = styled.header`
  padding: var(--gap-4);
  padding-right: var(--gap-4);
  margin-bottom: var(--gap-4);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 700;
`;
const ShowAllBtn = styled.button`
  background-color: rgba(0, 194, 179, 0.1);
  color: var(--color-mint);
  font-size: 13px;
`;
export default SectionHeader;
