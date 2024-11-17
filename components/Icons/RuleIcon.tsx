import styled from "styled-components";

import { IModal } from "../../types/components/modalTypes";
import { InfoCircleIcon } from "./CircleIcons";

function RuleIcon({ setIsModal }: IModal) {
  return (
    <Layout onClick={() => setIsModal(true)}>
      <InfoCircleIcon />
    </Layout>
  );
}

const Layout = styled.div`
  cursor: pointer;
`;

export default RuleIcon;
