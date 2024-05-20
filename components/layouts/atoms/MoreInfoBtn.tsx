import { useRouter } from "next/router";
import styled from "styled-components";

interface IMoreInfoBtn {
  url: string;
}

function MoreInfoBtn({ url }: IMoreInfoBtn) {
  const router = useRouter();
  return (
    <Layout
      onClick={() => {
        router.push(url);
      }}
    >
      <span>더보기</span>
      <i className="fa-solid fa-chevron-right fa-sm"  />
    </Layout>
  );
}

const Layout = styled.div`
  height: 44px;
  box-shadow: var(--shadow);
  display: flex;
  justify-content: center;
  background-color: white;
  align-items: center;
  margin-top: var(--gap-4);
  margin-bottom: var(--gap-5);
  border-radius: var(--rounded-lg);
  color: var(--gray-700);
  font-weight: 600;
  > span:first-child {
    margin-right: var(--gap-2);
  }
`;

export default MoreInfoBtn;
