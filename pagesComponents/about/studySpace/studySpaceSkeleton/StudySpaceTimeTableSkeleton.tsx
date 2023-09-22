import styled from "styled-components";
import { MainLoadingAbsolute } from "../../../../components/common/loaders/MainLoading";
import TimeTable from "../studySpaceTable/TimeTable";

function StudyTimeTableSkeleton() {
  return (
    <>
      <Table>
        <TimeTable />
        <MainLoadingAbsolute />
      </Table>
    </>
  );
}

const Table = styled.div`
  margin: 0 var(--margin-main);
  margin-top: var(--margin-main);
  padding-left: var(--padding-sub);
  position: relative;
  height: 195px;
`;

export default StudyTimeTableSkeleton;
