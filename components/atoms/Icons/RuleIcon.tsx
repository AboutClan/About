import styled from "styled-components";

import { IModal } from "../../../types/components/modalTypes";

function RuleIcon({ setIsModal }: IModal) {
  return (
    <Layout onClick={() => setIsModal(true)}>
      <i className="fa-light fa-info-circle fa-xl" style={{ color: "var(--gray-600)" }} />
    </Layout>
  );
}

const Layout = styled.div`
  cursor: pointer;
`;

export default RuleIcon;
