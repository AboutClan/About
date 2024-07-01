import styled from "styled-components";

import ProgressBar from "../atoms/ProgressBar";

interface IProgressStatus {
  value: number;
}

function ProgressStatus({ value }: IProgressStatus) {
  return (
    <Layout>
      <ProgressBar value={value} />
    </Layout>
  );
}

const Layout = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
`;

export default ProgressStatus;
