import Link from "next/link";
import styled from "styled-components";

interface IWritingIcon {
  url: string;
}

function WritingIcon({ url }: IWritingIcon) {
  return (
    <Link href={url}>
      <Layout>
        <i className="fa-light fa-pen-line fa-xl" style={{ color: "white" }} />
      </Layout>
    </Link>
  );
}

const Layout = styled.button`
  font-size: 16px;
  position: fixed;
  bottom: 92px;
  right: 16px;
  background-color: var(--color-mint);
  width: 58px;
  height: 58px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: 391px) {
    right: calc(((100vw - 390px) / 2) + 12px);
  }
`;

export default WritingIcon;
