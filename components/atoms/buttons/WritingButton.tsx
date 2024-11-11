import Link from "next/link";
import styled from "styled-components";

import { iPhoneNotchSize } from "../../../utils/validationUtils";

interface IWritingIcon {
  url: string;
  isBottomNav?: boolean;
  onClick?: () => void;
}

function WritingButton({ url, isBottomNav = true, onClick }: IWritingIcon) {
  return (
    <Link href={url} onClick={onClick}>
      <Layout isBottomNav={isBottomNav}>
        <i className="fa-light fa-pen-line fa-lg" style={{ color: "white" }} />
      </Layout>
    </Link>
  );
}

const Layout = styled.button<{ isBottomNav: boolean }>`
  font-size: 16px;
  position: fixed;
  bottom: ${(props) =>
    props.isBottomNav ? `calc(var(--bottom-nav-height) + 20px + ${iPhoneNotchSize()}px)` : "20px"};
  right: 20px;
  background-color: var(--color-mint);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: 391px) {
    right: calc(((100vw - 390px) / 2) + 12px);
  }
`;

export default WritingButton;
