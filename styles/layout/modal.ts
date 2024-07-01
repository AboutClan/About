import styled from "styled-components";

export const FullScreen = styled.div<{ opacity?: number }>`
  position: fixed;
  background-color: ${(props) =>
    props.opacity ? `rgba(0,0,0,${props.opacity})` : "rgba(0,0,0,0.4)"};
  width: 100vw;
  height: 100vh;
  z-index: 20;
  top: 0;
  left: 0;
`;

export const ModalHeaderLine = styled.header`
  color: var(--gray-800);
  font-weight: 600;
  font-size: 16px;
  border-bottom: var(--border);
  padding-bottom: var(--gap-3);
`;

interface IModalSubTitle {
  isCenter?: boolean;
}

export const ModalSubtitle = styled.div<IModalSubTitle>`
  margin-bottom: var(--gap-4);
  font-size: 16px;
  text-align: ${(props) => (props.isCenter ? "center" : "start")};
`;

export const ModalFooterNav = styled.footer`
  display: flex;
  justify-content: flex-end;
  margin-top: auto;

  > button {
    font-size: 14px;
    cursor: pointer;
  }
  > button:first-child {
    font-weight: 600;
    color: var(--gray-700);
    padding-right: var(--gap-2);
  }
  > button:nth-child(2) {
    padding-left: var(--gap-2);
    padding-right: 2px;
    color: var(--color-mint);
  }
  > button:last-child {
    font-weight: 600;
  }
`;

export const ModalHeaderCenter = styled.header`
  margin-top: var(--gap-3);
  text-align: center;
  padding-bottom: var(--gap-4);
  > span:first-child {
    font-size: 18px;
    font-weight: 600;
    color: var(--gray-800);
  }
  > div {
    margin-top: var(--gap-3);
    font-size: 13px;
    color: var(--gray-700);
  }
`;
