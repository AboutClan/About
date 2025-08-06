import Link from "next/link";
import styled from "styled-components";

import { iPhoneNotchSize } from "../../../utils/validationUtils";

interface IWritingIcon {
  url?: string;
  isBottomNav?: boolean;
  onClick?: () => void;
  type?: "thunder";
}

function WritingButton({ url, type, isBottomNav = true, onClick }: IWritingIcon) {
  return (
    <>
      {url ? (
        <Link href={url} onClick={onClick}>
          <Layout isBottomNav={isBottomNav}>
            {type === "thunder" ? (
              <i className="fa-light fa-bolt-lightning fa-lg" style={{ color: "white" }} />
            ) : (
              <WritingIcon />
            )}
          </Layout>
        </Link>
      ) : (
        <Layout isBottomNav={isBottomNav} onClick={onClick}>
          {type === "thunder" ? (
            <i className="fa-light fa-bolt-lightning fa-lg" style={{ color: "white" }} />
          ) : (
            <WritingIcon />
          )}
        </Layout>
      )}
    </>
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

function WritingIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="white"
  >
    <path d="M160 0q-33 0-56.5-23.5T80-80q0-33 23.5-56.5T160-160h640q33 0 56.5 23.5T880-80q0 33-23.5 56.5T800 0H160Zm80-320h56l312-311-29-29-28-28-311 312v56Zm-80 40v-113q0-8 3-15.5t9-13.5l436-435q11-11 25.5-17t30.5-6q16 0 31 6t27 18l55 56q12 11 17.5 26t5.5 31q0 15-5.5 29.5T777-687L342-252q-6 6-13.5 9t-15.5 3H200q-17 0-28.5-11.5T160-280Zm560-464-56-56 56 56ZM608-631l-29-29-28-28 57 57Z" />
  </svg>
}

export default WritingButton;
