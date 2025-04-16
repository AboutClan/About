import styled from "styled-components";

import { IModal } from "../../types/components/modalTypes";
import { InfoModalButton } from "../atoms/buttons/ModalButtons";

function RuleIcon({ setIsModal }: IModal) {
  return (
    <Layout onClick={() => setIsModal(true)}>
      <InfoModalButton handleClick={() => {}} />
    </Layout>
  );
}

const Layout = styled.div`
  cursor: pointer;
`;

export default RuleIcon;
